import { useReducer, useEffect, useState } from 'react'
import { isValidEmail } from '../utils/utils'

export const REG_ACTIONS = {
    HANDLE_NAME: 'handle-name',
    HANDLE_EMAIL: 'handle-email',
    HANDLE_PASSWORD: 'handle-password',
    SEND_REGISTER: 'send-register',
    SUCCESS: 'success',
    ALREADY_REGISTERED: 'already-registered',
    SERVER_ERROR: 'server-error',
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
    disabledBtn: false,
    highlightBadFields: false,
    alreadyRegistered: false,
    fetchInProgress: false,
    redirect: false,
    serverError: false,
}

export default function useRegister() {
    const [regState, regDispatcher] = useReducer(regReducer, regInitialState)
    const [sendFetch, setSendFetch] = useState(false)

    function regReducer(regState, action) {
        if (action.payload) {
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
                        highlightBadFields: false,
                        alreadyRegistered: false,
                    }

                case REG_ACTIONS.HANDLE_EMAIL:
                    return {
                        ...regState,
                        form: newForm,
                        badFields,
                        validEmail: isValidEmail(value),
                        highlightBadFields: false,
                        alreadyRegistered: false,
                    }

                case REG_ACTIONS.HANDLE_PASSWORD:
                    return {
                        ...regState,
                        form: newForm,
                        badFields,
                        validPassword: isValidPassword,
                        highlightBadFields: false,
                        alreadyRegistered: false,
                    }
            }
        }

        switch (action.type) {
            case REG_ACTIONS.SEND_REGISTER:
                if (regState.badFields.length > 0) {
                    return {
                        ...regState,
                        highlightBadFields: true,
                    }
                }

                action.setSendFetch(true)

                return {
                    ...regState,
                    disabledBtn: true,
                    fetchInProgress: true,
                }

            case REG_ACTIONS.SUCCESS:
                return {
                    ...regState,
                    redirect: true,
                }

            case REG_ACTIONS.ALREADY_REGISTERED:
                return {
                    ...regState,
                    disabledBtn: false,
                    alreadyRegistered: true,
                    fetchInProgress: false,
                }

            case REG_ACTIONS.SERVER_ERROR:
                return {
                    ...initialState,
                    serverError: true,
                }

            default:
                return regState
        }
    }

    useEffect(() => {
        if (sendFetch) {
            setSendFetch(false)
            ;(async regState => {
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
                        regDispatcher({
                            type: REG_ACTIONS.SUCCESS,
                        })
                        return
                    }

                    if (data.alreadyRegistered) {
                        regDispatcher({
                            type: REG_ACTIONS.ALREADY_REGISTERED,
                        })
                        return
                    }

                    if (res.status === 500) {
                        regDispatcher({
                            type: REG_ACTIONS.SERVER_ERROR,
                        })
                        return
                    }
                } catch (err) {
                    regDispatcher({
                        type: REG_ACTIONS.SERVER_ERROR,
                    })
                    return
                }
            })(regState)
        }
    }, [sendFetch])

    return { regState, regDispatcher, setSendFetch }
}
