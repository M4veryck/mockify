import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import styles from '../../styles/Login/Login.module.scss'
import useForm, { ACTIONS } from '../../components/hooks/useForm'
import { getInputData } from '../../components/utils/utils'

const initialState = {
    form: {
        email: '',
        password: '',
    },
    emailTyped: false,
    validEmail: true,
    badFields: ['email', 'password'],
    highlightBadFields: false,
    badLogin: false,
}

export default function Login() {
    const { state, dispatcher } = useForm(initialState)
    const [disabledBtn, setDisabledBtn] = useState(false)
    const [serverError, setServerError] = useState(false)
    const router = useRouter()

    const isBadFieldClass = id => {
        if (
            state.highlightBadFields &&
            state.badFields.some(field => field === id)
        ) {
            return styles['bad-field']
        }

        return ''
    }

    const fetchLoginApi = async state => {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(state.form),
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem('userToken', data.token)
                document.cookie = `userToken=${data.token}`
                router.push('/playlists')
                return
            }

            const errorCode = data.error_code || null

            if (
                errorCode === 'wrongPassword' ||
                errorCode === 'emailNotFound'
            ) {
                setDisabledBtn(false)
                dispatcher({ type: ACTIONS.HANDLE_BAD_LOGIN })
                return
            }

            if (res.status === 500) {
                setServerError(true)
                return
            }
        } catch (err) {
            console.log(err)
            setServerError(true)
        }
    }

    return (
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
                                className={`${
                                    styles['email']
                                } ${isBadFieldClass('email')}`}
                                onChange={e => {
                                    dispatcher({
                                        type: ACTIONS.HANDLE_FORM,
                                        payload: getInputData(e),
                                    })
                                }}
                            />
                            {!state.validEmail && (
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
                                className={`${
                                    styles['password']
                                } ${isBadFieldClass('password')}`}
                                onChange={e => {
                                    dispatcher({
                                        type: ACTIONS.HANDLE_FORM,
                                        payload: getInputData(e),
                                    })
                                }}
                            />

                            {state.badLogin && (
                                <p className={styles['bad-login']}>
                                    Incorrect email or password
                                </p>
                            )}

                            <button
                                disabled={disabledBtn}
                                className={styles['log-in--btn']}
                                onClick={e => {
                                    e.preventDefault()

                                    if (state.badFields.length > 0) {
                                        dispatcher({
                                            type: ACTIONS.SUBMIT_BAD_FORM,
                                        })
                                        return
                                    }

                                    setDisabledBtn(true)
                                    fetchLoginApi(state)
                                }}
                            >
                                {disabledBtn ? 'Verifying...' : 'Log In'}
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
    )
}
