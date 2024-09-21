import Video from "@renderer/components/Video";
import classes from "./Videos.module.css";
import { useEffect, useState } from "react";

export default function Videos(): JSX.Element {
    const [progress, setProgress] = useState(0);
    const [index, setIndex] = useState(0);
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    useEffect(() => {
        window.electron.ipcRenderer.on('preview-videos', (event, arg) => {
            setVideos(arg);
            setLoading(false);
        });
        window.electron.ipcRenderer.on('download-progress', (event, arg) => {
            setProgress(arg.percent);
            setIndex(arg.videosDone);
        });
    });

    const handleDownload = () => {
        window.electron.ipcRenderer.send('download', videos);
        setDownloading(true);
    }
    
    return (
        <div className='container'>
            <h1>Youtube Playlist downloader</h1>
            <ul className={classes.videos}>
            {loading && <li>Loading...</li>}  
            {videos.map((video, index) => <Video key={index} title={video.snippet.title} imgUrl={video.snippet.thumbnails.default.url} />)}
            </ul>
            {!downloading && <button className='btn' disabled={loading} onClick={handleDownload}>Download</button>}
            {downloading && <div>
                <h2>Downloading...</h2>
                <p>{progress}%</p>
                <p>{index} of {videos.length}</p>
            </div>}
        </div>
    )
}