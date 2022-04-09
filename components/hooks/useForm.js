import { useReducer } from 'react'
import { filterEmptyFields, isValidEmail } from '../utils/utils'

export const ACTIONS = {
    HANDLE_FORM: 'handle-form',
    SUBMIT_BAD_FORM: 'submit-bad-form',
    HANDLE_BAD_LOGIN: 'handle-bad-login',
}

export default function useForm(initialState) {
    const [state, dispatcher] = useReducer(reducer, initialState)

    function reducer(state, action) {
        switch (action.type) {
            case ACTIONS.HANDLE_FORM:
                const { name, value } = action.payload

                const newForm = {
                    ...state.form,
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

                if (name === 'email' || state.emailTyped) {
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

    return { state, dispatcher }
}
