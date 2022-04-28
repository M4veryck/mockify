import Head from 'next/head'
import Link from 'next/link'

import styles from '../../styles/Login/Login.module.scss'
import useLogin, { LOGIN_ACTIONS } from '../../components/hooks/useLogin'
import { getInputData } from '../../components/utils/utils'

export default function Login() {
    const { logState, logDispatcher } = useLogin()

    const isBadFieldClass = id => {
        if (
            logState.highlightBadFields &&
            logState.badFields.some(field => field === id)
        ) {
            return styles['bad-field']
        }

        return ''
    }

    return (
        <>
            <Head>
                <title>Log In - Mockify</title>
                <meta name="description" content="Log In" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className={styles['login--section']}>
                <main className={styles['login--container']}>
                    <>
                        <h2 className={styles['title']}>Log In</h2>
                        <p className={styles['description']}>
                            Log in to organize your playlists and add music to
                            them!
                        </p>

                        <form className={styles['form']}>
                            <label htmlFor="email">Email:</label>
                            <input
                                name="email"
                                id="email"
                                type="email"
                                required
                                value={logState.form.email}
                                autoComplete="email"
                                className={`${
                                    styles['email']
                                } ${isBadFieldClass('email')}`}
                                onChange={e => {
                                    logDispatcher({
                                        type: LOGIN_ACTIONS.HANDLE_FORM,
                                        payload: getInputData(e),
                                    })
                                }}
                            />
                            {!logState.validEmail && (
                                <p className={styles['invalid-email']}>
                                    Invalid Email
                                </p>
                            )}

                            <label htmlFor="password">Password:</label>
                            <input
                                name="password"
                                id="password"
                                type="password"
                                required
                                value={logState.form.password}
                                autoComplete="current-password"
                                className={`${
                                    styles['password']
                                } ${isBadFieldClass('password')}`}
                                onChange={e => {
                                    logDispatcher({
                                        type: LOGIN_ACTIONS.HANDLE_FORM,
                                        payload: getInputData(e),
                                    })
                                }}
                            />

                            {logState.badLogin && (
                                <p className={styles['bad-login']}>
                                    Incorrect email or password
                                </p>
                            )}

                            <button
                                disabled={logState.disabledBtn}
                                className={styles['log-in--btn']}
                                onClick={e => {
                                    e.preventDefault()

                                    logDispatcher({
                                        type: LOGIN_ACTIONS.SEND_LOGIN,
                                    })
                                }}
                            >
                                {logState.disabledBtn
                                    ? 'Verifying...'
                                    : 'Log In'}
                            </button>
                        </form>

                        <p className={styles['register-text']}>
                            Don't have an account yet?{' '}
                            <Link href="/register">Register!</Link>
                        </p>
                    </>
                </main>
            </section>
        </>
    )
}
