import classes from '../pages/Videos.module.css';

export default function Video({title, imgUrl}): JSX.Element {
    return (
        <li className={classes.video}>
            <img src={imgUrl} alt={title} />
            <h2>{title}</h2>
        </li>
    )
}