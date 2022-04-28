import { useRouter } from 'next/router'

import '../styles/globals.scss'
import Layout from '../components/layout/layout'
function MyApp({ Component, pageProps, redirect }) {
    // console.log(redirect)
    // const router = useRouter()
    // if (redirect?.destination === '/playlists') router.push('/playlists')

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
        if (
            context.ctx?.req?.cookies.presence &&
            !context.router?.route.startsWith('/playlists')
        ) {
            context.ctx.res.writeHead(301, {
                Location: '/playlists',
            })
            context.ctx.res.end()
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
