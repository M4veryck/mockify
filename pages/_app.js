import '../styles/globals.scss'
import Layout from '../components/layout/layout'
import { PlaylistsContextProvider } from '../components/playlistsContext'

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
