import { useNavigate } from 'react-router-dom';
import classes from './Form.module.css';

export default function Form(): JSX.Element {
    const navigate = useNavigate();
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        window.electron.ipcRenderer.send('get-videos', (event.target as HTMLFormElement).url.value);
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