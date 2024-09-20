import classes from './Form.module.css';

export default function Form(): JSX.Element {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        window.electron.ipcRenderer.send('get-playlist', (event.target as HTMLFormElement).url.value)
    }
    return (
        <form className={classes.form} onSubmit={handleSubmit}>
        <label htmlFor="url">Please type the URL:</label>
        <input type="text" id="url" name="url" />
        <button type="submit">Download</button>
        </form>
    )
}