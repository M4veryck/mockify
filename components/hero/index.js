import Link from 'next/link'

import styles from '../../styles/Hero/Hero.module.scss'

export default function Hero() {
    return (
        <section className={styles['hero--section']} id="main">
            <div className={styles['hero--container']}>
                <h1 className={styles['title']}>
                    Discover <br />{' '}
                    <span className={styles['word-new']}>new</span> <br />
                    music
                </h1>
                <h2 className={styles['caption']}>
                    (Whitout ever getting to listen to it)
                </h2>
            </div>

            <Link href="/login">
                <a className={styles['log-in--btn']}>Log in</a>
            </Link>
        </section>
    )
}
