import Head from 'next/head'
import Hero from '../components/hero'

import styles from '../styles/Home.module.scss'

export default function Home() {
    return (
        <>
            <Head>
                <title>Mockify</title>
                <meta
                    name="description"
                    content="Create and edit playlists by adding them your favorite songs"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className={styles['page--container']} id="page--container">
                <Hero />
            </div>
        </>
    )
}
