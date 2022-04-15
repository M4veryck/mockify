import { useReducer } from 'react'
import { getAllData } from '../playlists/CRUD'
import { filterEmptyFields, isValidEmail } from '../utils/utils'

export const LOGIN_ACTIONS = {
    HANDLE_FORM: 'handle-form',
    SEND_LOGIN: 'send-login',
    BAD_LOGIN: 'bad-login',
}

export default function useLogin(initialState) {
    const [logState, logDispatcher] = useReducer(logReducer, initialState)

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

                const fetchLoginApi = action.payload

                fetchLoginApi(logState, getAllData)

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

    return { logState, logDispatcher }
}
