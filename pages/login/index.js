import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'

import styles from '../../styles/Login/Login.module.scss'
import useLogin, { LOGIN_ACTIONS } from '../../components/hooks/useLogin'
import { getInputData } from '../../components/utils/utils'
import { PlaylistsContextConsumer } from '../../components/playlistsContext'

const initialState = {
    form: {
        email: '',
        password: '',
    },
    emailTyped: false,
    validEmail: true,
    badFields: ['email', 'password'],
    highlightBadFields: false,
    disabledBtn: false,
    badLogin: false,
    fetchInProgress: false,
}

export default function Login() {
    const { toPlaylists } = PlaylistsContextConsumer()
    const { logState, logDispatcher } = useLogin(initialState)
    const { playlistsDispatcher } = PlaylistsContextConsumer()
    const [serverError, setServerError] = useState(false)
    const router = useRouter()

    if (toPlaylists) {
        router.push('/playlists')
    }

    const isBadFieldClass = id => {
        if (
            logState.highlightBadFields &&
            logState.badFields.some(field => field === id)
        ) {
            return styles['bad-field']
        }

        return ''
    }

    const fetchLoginApi = async (logState, getAllData) => {
        if (!logState.fetchInProgress) {
            try {
                const res = await fetch('/api/auth/login', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(logState.form),
                })

                const data = await res.json()

                if (res.ok) {
                    localStorage.setItem('userToken', data.token)
                    await getAllData(playlistsDispatcher)
                    router.push('/playlists')
                    return
                }

                const errorCode = data.error_code || null

                if (
                    errorCode === 'wrongPassword' ||
                    errorCode === 'emailNotFound'
                ) {
                    logDispatcher({ type: LOGIN_ACTIONS.BAD_LOGIN })
                    return
                }

                if (res.status === 500) {
                    setServerError(true)
                    return
                }
            } catch (err) {
                setServerError(true)
            }
        }
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
                    {serverError ? (
                        <p className={styles['server-error']}>
                            Oops! <br />
                            500: Server Error. <br />
                            Please refresh and try again.
                        </p>
                    ) : (
                        <>
                            <h2 className={styles['title']}>Log In</h2>
                            <p className={styles['description']}>
                                Log in to organize your playlists and add music
                                to them!
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
                                            payload: fetchLoginApi,
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
                    )}
                </main>
            </section>
        </>
    )
}
