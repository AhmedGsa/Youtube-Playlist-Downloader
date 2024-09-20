import classes from './Form.module.css';

export default function Form(): JSX.Element {
    return (
        <form className={classes.form}>
        <label htmlFor="url">Please type the URL:</label>
        <input type="text" id="url" name="url" />
        <button type="submit">Download</button>
        </form>
    )
}