import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import fs from 'fs'
import os from 'os'
import path from 'path'
import icon from '../../resources/icon.png?asset'
import { google } from 'googleapis'
import dotenv from 'dotenv'
import youtubeDl from 'youtube-dl-exec'
dotenv.config();

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: true,
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('get-videos', async (event, arg) => {
    if(arg.includes('list=')) {
      const playlistId = arg.split('list=')[1].split('&')[0];
      // get the video info
      const res = await youtube.playlistItems.list({
        part: ['snippet'],
        playlistId: playlistId,
        maxResults: 100,
      });
      event.sender.send('preview-videos', res.data.items);
      return;
    }
    const videoId = arg.split('v=')[1];
    const res = await youtube.videos.list({
      part: ['snippet'],
      id: [videoId],
    });
    event.sender.send('preview-videos', res.data.items);
  });

  ipcMain.on('download', async (event, arg) => {
    try {
      // save the file in the downloads folder
      let dest = path.join(os.homedir(), 'youtube-downloader');
      const video = arg[0];
      // check if it has a playlist id
      if(video.snippet.playlistId) {
        // get playlist name
        const playlist = await youtube.playlists.list({
          part: ['snippet'],
          id: [video.snippet.playlistId],
        });
        const playlistName = playlist.data.items?.[0].snippet?.title as string;
        // Update the destination
        dest = path.join(os.homedir(), 'youtube-downloader', playlistName);
      }
      // Create directory if it doesn't exist
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
      }
      let videosDone = 0;
      for(const video of arg) {
        await new Promise((resolve, reject) => {
          const promise = youtubeDl.exec(`https://www.youtube.com/watch?v=${video.snippet.resourceId?.videoId || video.id}`, {
            format: 'mp4',
            output: path.join(dest, '%(title)s.%(ext)s')
          }, {
              stdio: ['ignore', 'pipe', 'pipe'],
          });
          promise.stdout?.on('data', (data) => {
            const output = data.toString();
            const progressMatch = output.match(/\[download\] +(\d+\.\d+)%/);
    
            if (progressMatch) {
              const percent = parseFloat(progressMatch[1]);
              if (percent === 100) {
                console.log(percent);
                
                videosDone++;
              }
              event.sender.send('download-progress', { percent, videosDone });
            }
          });
          promise.on('close', () => {
            resolve(true);
          });
        })
      }
      event.sender.send('download-done');
      // show a dialog when the download is done
      dialog.showMessageBox({
        type: 'info',
        title: 'Download complete',
        message: 'All videos have been downloaded',
        buttons: ['Ok', 'Open folder'],
      }).then((res) => {
        if(res.response === 1) {
          shell.openPath(dest);
        }
      });
    } catch (error) {
      console.error(error);
    }
  });

  ipcMain.on('cancel-download', () => {
    // cancel the download
  });

  ipcMain.on('open-download-folder', () => {
    // open the download folder
    shell.openPath(path.join(os.homedir(), 'youtube-downloader'));
  });

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
