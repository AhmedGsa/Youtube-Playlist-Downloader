import { useNavigate } from 'react-router-dom';
import classes from './Form.module.css';

export default function Form(): JSX.Element {
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const url = (event.target as HTMLFormElement).url.value;
        console.log(url);
        
        if(!url.startsWith('https://www.youtube.com/playlist?list=')
            && !url.startsWith('https://youtube.com/playlist?list=')
            && !url.startsWith('https://m.youtube.com/playlist?list=')
            && !url.startsWith('https://www.youtube.com/watch?v=cw34KMPSt4k')
            && !url.startsWith('https://youtube.com/watch?v=')
            && !url.startsWith('https://m.youtube.com/watch?v=')
        ) {
            alert('Please enter a valid youtube video or playlist URL');
            return;
        }
        window.electron.ipcRenderer.send('get-videos', url);
        navigate('/videos');
    }
    return (
        <form className={classes.form} onSubmit={handleSubmit}>
        <label htmlFor="url">Please type the URL:</label>
        <input type="text" id="url" name="url" />
        <button type="submit" className='btn'>Download</button>
        </form>
    )
}