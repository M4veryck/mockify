import { useRouter } from 'next/router'

import Head from 'next/head'
import Hero from '../components/hero'

import styles from '../styles/Home.module.scss'
import { useEffect } from 'react'
import { PlaylistsContextConsumer } from '../components/playlistsContext'

export default function Home() {
    // const { toPlaylists } = PlaylistsContextConsumer()
    const router = useRouter()

    // useEffect(() => {
    //     document.cookie = 'hello=world'
    //     if (toPlaylists) {
    //         router.push('/playlists')
    //     }
    // }, [toPlaylists])

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
