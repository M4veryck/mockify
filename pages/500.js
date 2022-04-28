import Head from 'next/head'

import styles from '../styles/Custom500.module.scss'

export default function Custom500() {
    return (
        <>
            <Head>
                <title>Server Error - Mockify</title>
                <meta
                    name="description"
                    content="Add, edit and delete custom playlists"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles['server-error']}>
                <h1 className={styles['sad-face']}>:(</h1>
                <p className={styles['server-error--message']}>
                    500 Error <br /> <br />
                    My server ran into a problem (sorry for the inconviniences),
                    please try again later.
                </p>
            </div>
        </>
    )
}
