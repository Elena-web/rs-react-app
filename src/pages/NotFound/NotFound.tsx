import s from './NotFound.module.scss';
const NotFoundPage = () => {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <h1 className={s.title}>404</h1>
        <p className={s.txt}>
          Oops! The page you&apos;re looking for doesn&apos;t exist.
        </p>
      </div>
    </div>
  );
};

export default NotFoundPage;
