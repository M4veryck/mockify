import Head from 'next/head'
import Link from 'next/link'

import styles from '../../styles/Register/Register.module.scss'
import { getInputData } from '../../components/utils/utils'
import useRegister, { REG_ACTIONS } from '../../components/hooks/useRegister'

export default function Register() {
    const { regState, regDispatcher } = useRegister()

    const isBadFieldClass = id => {
        if (
            regState.highlightBadFields &&
            regState.badFields.some(field => field === id)
        ) {
            return styles['bad-field']
        }

        return ''
    }

    return (
        <>
            <Head>
                <title>Register - Mockify</title>
                <meta name="description" content="Register" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <section className={styles['login--section']}>
                <main className={styles['login--container']}>
                    <h2 className={styles['title']}>Register</h2>

                    <form className={styles['form']}>
                        <label htmlFor="name">Name:</label>
                        <input
                            name="name"
                            id="name"
                            type="text"
                            required
                            value={regState.form.name}
                            autoComplete="name"
                            className={`${styles['name']} ${isBadFieldClass(
                                'name'
                            )}`}
                            onChange={e => {
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
                            autoComplete="email"
                            className={`${styles['email']} ${isBadFieldClass(
                                'email'
                            )}`}
                            onChange={e => {
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
                            autoComplete="new-password"
                            value={regState.form.password}
                            className={`${styles['password']} ${isBadFieldClass(
                                'password'
                            )}`}
                            onChange={e => {
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

                        {regState.alreadyRegistered && (
                            <p className={styles['already-registered']}>
                                {' '}
                                User with email {regState.form.email} already
                                registered
                            </p>
                        )}

                        <button
                            disabled={regState.disabledBtn}
                            className={styles['log-in--btn']}
                            onClick={e => {
                                e.preventDefault()

                                regDispatcher({
                                    type: REG_ACTIONS.SEND_REGISTER,
                                })
                            }}
                        >
                            {regState.disabledBtn ? 'Verifying...' : 'Register'}
                        </button>
                    </form>

                    <p className={styles['register-text']}>
                        Already have an account?{' '}
                        <Link href="/login">Log In</Link>
                    </p>
                </main>
            </section>
        </>
    )
}
