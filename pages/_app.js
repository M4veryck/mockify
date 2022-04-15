import '../styles/globals.scss'
import Layout from '../components/layout/layout'
import { NavBarContextProvider } from '../components/navBarContext'
import { PlaylistsContextProvider } from '../components/playlistsContext'

function MyApp({ Component, pageProps }) {
    return (
        // <NavBarContextProvider>
        <PlaylistsContextProvider>
            <div className={'page--container'}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </div>
        </PlaylistsContextProvider>
        // </NavBarContextProvider>
    )
}

export default MyApp
