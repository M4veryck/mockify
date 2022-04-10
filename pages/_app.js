import '../styles/globals.scss'
import Layout from '../components/layout/layout'
import { NavBarContextProvider } from '../components/navBarContext'

function MyApp({ Component, pageProps }) {
    return (
        <NavBarContextProvider>
            <div className={'page--container'}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </div>
        </NavBarContextProvider>
    )
}

export default MyApp
