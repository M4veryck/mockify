import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import '../styles/globals.scss'
import Layout from '../components/layout/layout'
import {
    PlaylistsContextConsumer,
    PlaylistsContextProvider,
} from '../components/playlistsContext'
import { getAllData } from '../components/playlists/CRUD'

function MyApp({ Component, pageProps }) {
    return (
        <PlaylistsContextProvider>
            <div className={'page--container'}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </div>
        </PlaylistsContextProvider>
    )
}

export default MyApp
