import Video from "@renderer/components/Video";
import classes from "./Videos.module.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Videos(): JSX.Element {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [index, setIndex] = useState(0);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        window.electron.ipcRenderer.on('preview-videos', (event, arg) => {
            setVideos(arg);
            setLoading(false);
        });
        window.electron.ipcRenderer.on('download-progress', (event, arg) => {
            setProgress(arg.percent);
            setIndex(arg.videosDone);
        });
        window.electron.ipcRenderer.on('download-done', () => {
            setDone(true);
            setDownloading(false);
        });
    });

    const handleDownload = () => {
        window.electron.ipcRenderer.send('download', videos);
        setDownloading(true);
    }
    console.log(videos);
    

    const cancelDownload = () => {
        if(downloading) {
            window.electron.ipcRenderer.send('cancel-download');
            setDownloading(false);
        } else {
            navigate('/');
        }
    }

    const openDownloadFolder = () => {
        window.electron.ipcRenderer.send('open-download-folder');
    }
    
    return (
        <div className='container'>
            <h1>Youtube Playlist downloader</h1>
            <ul className={classes.videos}>
            {loading && <li>Loading...</li>}  
            {videos.map((video, index) => <Video key={index} title={video.snippet.title} imgUrl={video.snippet.thumbnails.default.url} />)}
            </ul>
            <div className={classes.btns}>
                {!downloading && !done && <button className='btn' disabled={loading} onClick={handleDownload}>Download</button>}
                {!done && <button className='btn' onClick={cancelDownload}>Cancel</button>}
            </div>
            {downloading && <div>
                <h2>Downloading...</h2>
                <p>{progress}%</p>
                <p>{index} of {videos.length}</p>
            </div>}
            {done && <div className={classes.btns}>
                <button className='btn' onClick={openDownloadFolder}>Open downloads folder</button>
                <button className='btn' onClick={() => navigate('/')}>Download another</button>
            </div>}
        </div>
    )
}