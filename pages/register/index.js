import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import Layout from '../../components/layout/layout'
import styles from '../../styles/Register/Register.module.scss'
import useForm, { ACTIONS } from '../../components/hooks/useForm'
import { getInputData } from '../../components/utils/utils'

const initialState = {
    form: {
        name: '',
        email: '',
        password: '',
    },
    emailTyped: false,
    validEmail: true,
    badFields: ['name', 'email', 'password'],
    highlightBadFields: false,
    badLogin: false,
}

export default function Register() {
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
            const res = await fetch('/api/auth/register', {
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
                router.push('/')
                return
            }

            console.log(data)

            setDisabledBtn(false)
            dispatcher({ type: ACTIONS.HANDLE_BAD_LOGIN })
            return
        } catch (err) {
            console.log(err)
            setServerError(true)
        }
    }

    return (
        <section className={styles['login--section']}>
            <Layout>
                <main className={styles['login--container']}>
                    {serverError ? (
                        <p className={styles['server-error']}>
                            Oops! <br />
                            Error 500: Server Error. <br />
                            Please refresh and try again.
                        </p>
                    ) : (
                        <>
                            <h2 className={styles['title']}>Register</h2>

                            <form className={styles['form']}>
                                <label htmlFor="name">Name:</label>
                                <input
                                    name="name"
                                    id="name"
                                    type="text"
                                    required
                                    className={`${
                                        styles['name']
                                    } ${isBadFieldClass('name')}`}
                                    onChange={e => {
                                        dispatcher({
                                            type: ACTIONS.HANDLE_FORM,
                                            payload: getInputData(e),
                                        })
                                    }}
                                />

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
                                    {disabledBtn ? 'Verifying...' : 'Register'}
                                </button>
                            </form>

                            <p className={styles['register-text']}>
                                Already have an account?{' '}
                                <Link href="/login">Log In</Link>
                            </p>
                        </>
                    )}
                </main>
            </Layout>
        </section>
    )
}
