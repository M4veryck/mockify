import '../styles/globals.scss'
import Layout from '../components/layout/layout'
// import { PlaylistsContextProvider } from '../components/playlistsContext'

function MyApp({ Component, pageProps }) {
    return (
        // <PlaylistsContextProvider>
        <div className={'page--container'}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </div>
        // </PlaylistsContextProvider>
    )
}

MyApp.getInitialProps = async context => {
    // console.log(context)
    if (typeof context !== 'undefined') {
        if (
            context.ctx?.req?.cookies.presence &&
            context.router?.route !== '/playlists'
        ) {
            // console.log('return from app ran')
            return {
                redirect: {
                    destination: '/playlists',
                    permanent: false,
                },
            }
        }
    }
    return {}
}

export default MyApp
