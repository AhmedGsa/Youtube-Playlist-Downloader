import Video from "@renderer/components/Video";
import classes from "./Videos.module.css";
import { useEffect, useState } from "react";

export default function Videos(): JSX.Element {
    const [videos, setVideos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        window.electron.ipcRenderer.on('preview-videos', (event, arg) => {
            setVideos(arg);
            setLoading(false);
        });
    });
    console.log(videos);
    
    return (
        <div className='container'>
            <h1>Youtube Playlist downloader</h1>
            <ul className={classes.videos}>
            {loading && <li>Loading...</li>}  
            {videos.map((video, index) => <Video key={index} title={video.snippet.title} imgUrl={video.snippet.thumbnails.default.url} />)}
            </ul>
            <button className='btn' disabled={loading}>Download</button>
        </div>
    )
}