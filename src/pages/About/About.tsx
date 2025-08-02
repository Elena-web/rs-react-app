import authorPhoto from '../../assets/author.jpeg';
import { Link } from 'react-router-dom';
import s from './About.module.scss';

function About() {
  return (
    <div className={s.container}>
      <div className={s.card}>
        <h1 className={s.title}>About me</h1>

        <div className={s.content}>
          <div className={s.img}>
            <img src={authorPhoto} alt="Elena Pavlovich" />
          </div>
          <div className="description">
            <h2>Elena Pavlovich</h2>
            <p>Frontend Developer</p>
          </div>
        </div>
        <a
          href="https://rs.school/courses/reactjs"
          className={s.link}
          target="_blank"
          rel="noreferrer"
        >
          Made in Rolling Scopes School
        </a>
        <Link to="/" className={s.btn__back}>
          ← Back to Cats
        </Link>
      </div>
    </div>
  );
}

export default About;
