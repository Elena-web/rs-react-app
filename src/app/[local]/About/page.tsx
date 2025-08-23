import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import authorPhoto from '../../../assets/author.jpeg';
import s from './About.module.scss';

export default function AboutPage() {
  return (
    <div className={s.container}>
      <div className={s.card}>
        <h1 className={s.title}>About me</h1>

        <div className={s.content}>
          <div className={s.img}>
            <Image
              src={authorPhoto}
              alt="Elena Pavlovich"
              width={150}
              height={150}
            />
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

        <Link href="/" className={s.btn__back}>
          ← Back to Cats
        </Link>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [
    { local: 'en' },
    { local: 'ru' },
  ];
}