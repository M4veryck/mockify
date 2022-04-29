import '../styles/globals.scss'
import Layout from '../components/layout/layout'
function MyApp({ Component, pageProps }) {
    return (
        <div className={'page--container'}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </div>
    )
}

MyApp.getInitialProps = async context => {
    if (typeof context !== 'undefined') {
        const presenceCookie = context.ctx?.req?.cookies.presence
        const routeContainsPlaylists =
            context.router?.route.startsWith('/playlists')
        if (presenceCookie && !routeContainsPlaylists) {
            const res = context.ctx.res

            res.writeHead(301, {
                Location: '/playlists',
            })
            res.end()
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
