import { useRouter } from 'next/router'
import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

import styles from '../../styles/AboutMe/AboutMe.module.scss'
import useOnScreen from '../hooks/useOnScreen'

export default function AboutMe() {
    return (
        <section className={styles.AboutMe} id="about">
            <div className={styles.aboutMeContainer}>
                <h2 className={styles.title}>Who I am</h2>
                <span className={styles.number}>1</span>
                <p className={styles.myDescription}>
                    I{`'`}m <strong>Maveryck Maya</strong>, a Colombian frontend
                    dev who{`'`}s in its path towards becoming a fullstack
                    engineer.
                </p>
                <span className={styles.number}>2</span>
                <p className={styles.myDescription}>
                    Being a Math undergrad student,{' '}
                    <strong>quick and creative problem solving</strong> have
                    become second nature.
                </p>
                <span className={styles.number}>3</span>
                <p className={styles.myDescription}>
                    I know, after graduating from{' '}
                    <Link href="https://scrimba.com">
                        <a target="_blank">Scrimba</a>
                    </Link>
                    , the fundamentals about{' '}
                    <strong>Responsive Design, UI and UX</strong>, which allows
                    me to develop quality content.
                </p>
                <h3 className={styles.subsectionTitle}>Skills</h3>
                <div className={styles.skillsContainer}>
                    <h3 className={styles.skillsTitle}>Frontend:</h3>
                    <p className={styles.skills}>
                        HTML, CSS, Sass, JavaScript, React.
                    </p>
                </div>
                <div className={styles.skillsContainer}>
                    <h3 className={styles.skillsTitle}>Backend:</h3>
                    <p className={styles.skills}>
                        Node.js, Express, Mongoose, Next.js.
                    </p>
                </div>
                <div className={styles.skillsContainer}>
                    <h3 className={styles.skillsTitle}>Others:</h3>
                    <p className={styles.skills}>Git, Heroku.</p>
                </div>
            </div>
        </section>
    )
}