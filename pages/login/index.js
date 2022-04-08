import { useEffect, useReducer, useState } from 'react'

import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/layout/layout'
import styles from '../../styles/Login/Login.module.scss'
import { isValidEmail } from '../../components/utils/utils'

const ACTIONS = {
    HANDLE_FORM: 'handle-form',
    SUBMIT_BAD_FORM: 'submit-bad-form',
    HANDLE_BAD_LOGIN: 'handle-bad-login',
}

const getInputData = e => {
    const { name, value } = e.target
    return { name, value }
}

export default function Login() {
    const [state, dispatcher] = useReducer(reducer, {
        form: {
            email: '',
            password: '',
        },
        emailTyped: false,
        validEmail: true,
        badFields: ['email', 'password'],
        highlightBadFields: false,
        badLogin: false,
    })

    const [disabledBtn, setDisabledBtn] = useState(false)
    const [fetchLoginApi, setFetchLoginApi] = useState(false)
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

    function reducer(state, action) {
        switch (action.type) {
            case ACTIONS.HANDLE_FORM:
                const { name, value } = action.payload

                const newForm = {
                    ...state.form,
                    [name]: value,
                }

                const badFields = []

                if (!isValidEmail(newForm.email)) {
                    badFields.push('email')
                }

                if (!newForm.password) {
                    badFields.push('password')
                }

                if (name === 'email' || state.emailTyped) {
                    return {
                        form: newForm,
                        emailTyped: true,
                        validEmail: isValidEmail(newForm.email),
                        badFields,
                        highlightBadFields: false,
                        badLogin: false,
                    }
                }

                return {
                    form: newForm,
                    emailTyped: false,
                    validEmail: true,
                    badFields,
                    highlightBadFields: false,
                    badLogin: false,
                }

            case ACTIONS.SUBMIT_BAD_FORM:
                return {
                    ...state,
                    highlightBadFields: true,
                }

            case ACTIONS.HANDLE_BAD_LOGIN:
                return {
                    ...state,
                    badLogin: true,
                }

            default:
                return state
        }
    }

    useEffect(() => {
        if (fetchLoginApi) {
            fetch('https://playlists-api-01.herokuapp.com/api/v1/auth/login', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(state.form),
            })
                .then(res => {
                    if (res.ok) {
                        console.log('Successful login')
                        router.push('/')
                        return
                    }
                    setDisabledBtn(false)
                    setFetchLoginApi(false)
                    dispatcher({ type: ACTIONS.HANDLE_BAD_LOGIN })
                })
                .catch(err => {
                    console.log(err)
                    throw new Error('500 not found')
                })
        }
    }, [fetchLoginApi])

    return (
        <section className={styles['login--section']}>
            <Layout>
                <main className={styles['login--container']}>
                    <h2 className={styles['title']}>Log In</h2>

                    <form className={styles['form']}>
                        <label htmlFor="email">Email:</label>
                        <input
                            name="email"
                            id="email"
                            type="email"
                            required
                            className={`${styles['email']} ${isBadFieldClass(
                                'email'
                            )}`}
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
                            className={`${styles['password']} ${isBadFieldClass(
                                'password'
                            )}`}
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
                                setFetchLoginApi(true)
                            }}
                        >
                            {disabledBtn ? 'Verifying...' : 'Log In'}
                        </button>
                    </form>

                    <p className={styles['register-text']}>
                        Don't have an account yet?{' '}
                        <Link href="/register">Register!</Link>
                    </p>
                </main>
            </Layout>
        </section>
    )
}
