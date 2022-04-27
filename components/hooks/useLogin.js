import { useReducer } from 'react'
import { useRouter } from 'next/router'

import { getAllData } from '../playlists/CRUD'
import { filterEmptyFields, isValidEmail } from '../utils/utils'

export const LOGIN_ACTIONS = {
    HANDLE_FORM: 'handle-form',
    SEND_LOGIN: 'send-login',
    BAD_LOGIN: 'bad-login',
}

export default function useLogin(initialState) {
    const [logState, logDispatcher] = useReducer(logReducer, initialState)
    const router = useRouter()

    function logReducer(logState, action) {
        switch (action.type) {
            case LOGIN_ACTIONS.HANDLE_FORM:
                const { name, value } = action.payload

                const newForm = {
                    ...logState.form,
                    [name]: value,
                }

                const badFields = filterEmptyFields(newForm)

                if (!isValidEmail(newForm.email)) {
                    badFields.push('email')
                }

                const genericNewState = {
                    form: newForm,
                    badFields,
                    highlightBadFields: false,
                    badLogin: false,
                }

                if (name === 'email' || logState.emailTyped) {
                    return {
                        ...genericNewState,
                        emailTyped: true,
                        validEmail: isValidEmail(newForm.email),
                    }
                }

                return {
                    ...genericNewState,
                    emailTyped: false,
                    validEmail: true,
                }

            case LOGIN_ACTIONS.SEND_LOGIN:
                if (logState.badFields.length > 0) {
                    return {
                        ...logState,
                        highlightBadFields: true,
                    }
                }

                fetchLoginApi(logState)

                return {
                    ...logState,
                    disabledBtn: true,
                    fetchInProgress: true,
                }

            case LOGIN_ACTIONS.BAD_LOGIN:
                return {
                    ...logState,
                    disabledBtn: false,
                    badLogin: true,
                    fetchInProgress: false,
                }

            default:
                return logState
        }
    }

    async function fetchLoginApi(logState) {
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
                    const dateAfter1Day = new Date(
                        new Date().getTime() + 60 * 60 * 24 * 1000
                    )
                    document.cookie = `presence=${
                        data.token
                    }; path='/'; expires=${dateAfter1Day.toUTCString()}`
                    router.push('/playlists')
                    return
                }

                // const errorCode = data.error_code || null

                // if (
                //     errorCode === 'wrongPassword' ||
                //     errorCode === 'emailNotFound'
                // ) {
                //     logDispatcher({ type: LOGIN_ACTIONS.BAD_LOGIN })
                //     return
                // }

                // if (res.status === 500) {
                //     setServerError(true)
                //     return
                // }
            } catch (err) {
                // setServerError(true)
                console.log(err)
            }
        }
    }

    return { logState, logDispatcher }
}
