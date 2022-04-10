import { useState, useReducer } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

import styles from '../../styles/Register/Register.module.scss'
import { getInputData, isValidEmail } from '../../components/utils/utils'

const REG_ACTIONS = {
    HANDLE_NAME: 'handle-name',
    HANDLE_EMAIL: 'handle-email',
    HANDLE_PASSWORD: 'handle-password',
}

const regInitialState = {
    form: {
        name: '',
        email: '',
        password: '',
    },
    validName: true,
    validEmail: true,
    validPassword: true,
    badFields: ['name', 'email', 'password'],
}

export default function Register() {
    const [regState, regDispatcher] = useReducer(regReducer, regInitialState)
    const [disabledBtn, setDisabledBtn] = useState(false)
    const [highlightBadFields, setHighlightBadFields] = useState(false)
    const [serverError, setServerError] = useState(false)
    const [alreadyRegistered, setAlreadyRegistered] = useState(false)
    const router = useRouter()

    const isBadFieldClass = id => {
        if (
            highlightBadFields &&
            regState.badFields.some(field => field === id)
        ) {
            return styles['bad-field']
        }

        return ''
    }

    function regReducer(regState, action) {
        const { name, value } = action.payload
        const newForm = {
            ...regState.form,
            [name]: value,
        }

        const isValidName = newForm.name.length >= 4
        const isValidPassword = newForm.password.length >= 6

        const badFields = []

        if (!isValidName) badFields.push('name')
        if (!isValidEmail(newForm.email)) badFields.push('email')
        if (!isValidPassword) badFields.push('password')

        switch (action.type) {
            case REG_ACTIONS.HANDLE_NAME:
                return {
                    ...regState,
                    form: newForm,
                    badFields,
                    validName: isValidName,
                }

            case REG_ACTIONS.HANDLE_EMAIL:
                return {
                    ...regState,
                    form: newForm,
                    badFields,
                    validEmail: isValidEmail(value),
                }

            case REG_ACTIONS.HANDLE_PASSWORD:
                return {
                    ...regState,
                    form: newForm,
                    badFields,
                    validPassword: isValidPassword,
                }
            default:
                return regState
        }
    }

    const fetchRegisterApi = async regState => {
        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(regState.form),
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem('userToken', data.token)
                router.push('/playlists')
                return
            }

            if (data.alreadyRegistered) {
                setAlreadyRegistered(true)
                setDisabledBtn(false)
            }

            if (res.status === 500) {
                setServerError(true)
                return
            }
        } catch (err) {
            setServerError(true)
            return
        }
    }

    console.log(regState)

    return (
        <section className={styles['login--section']}>
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
                                value={regState.form.name}
                                className={`${styles['name']} ${isBadFieldClass(
                                    'name'
                                )}`}
                                onChange={e => {
                                    setHighlightBadFields(false)
                                    setAlreadyRegistered(false)
                                    regDispatcher({
                                        type: REG_ACTIONS.HANDLE_NAME,
                                        payload: getInputData(e),
                                    })
                                }}
                            />
                            {!regState.validName && (
                                <p className={styles['invalid-field']}>
                                    Name must be at least 4 characters long
                                </p>
                            )}

                            <label htmlFor="email">Email:</label>
                            <input
                                name="email"
                                id="email"
                                type="email"
                                required
                                value={regState.form.email}
                                className={`${
                                    styles['email']
                                } ${isBadFieldClass('email')}`}
                                onChange={e => {
                                    setHighlightBadFields(false)
                                    setAlreadyRegistered(false)
                                    regDispatcher({
                                        type: REG_ACTIONS.HANDLE_EMAIL,
                                        payload: getInputData(e),
                                    })
                                }}
                            />
                            {!regState.validEmail && (
                                <p className={styles['invalid-field']}>
                                    Invalid Email
                                </p>
                            )}

                            <label htmlFor="password">Password:</label>
                            <input
                                name="password"
                                id="password"
                                type="password"
                                required
                                value={regState.form.password}
                                className={`${
                                    styles['password']
                                } ${isBadFieldClass('password')}`}
                                onChange={e => {
                                    setHighlightBadFields(false)
                                    setAlreadyRegistered(false)
                                    regDispatcher({
                                        type: REG_ACTIONS.HANDLE_PASSWORD,
                                        payload: getInputData(e),
                                    })
                                }}
                            />

                            {!regState.validPassword && (
                                <p className={styles['invalid-field']}>
                                    Password must be at least 6 characters long
                                </p>
                            )}

                            {alreadyRegistered && (
                                <p className={styles['already-registered']}>
                                    {' '}
                                    User with email {regState.form.email}{' '}
                                    already registered
                                </p>
                            )}

                            <button
                                disabled={disabledBtn}
                                className={styles['log-in--btn']}
                                onClick={e => {
                                    e.preventDefault()

                                    if (regState.badFields.length > 0) {
                                        setHighlightBadFields(true)
                                        return
                                    }

                                    setDisabledBtn(true)
                                    fetchRegisterApi(regState)
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
        </section>
    )
}
