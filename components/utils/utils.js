export const isValidEmail = email => {
    if (
        email.match(
            /^((([!#$%&'*+\-/=?^_`{|}~\w])|([!#$%&'*+\-/=?^_`{|}~\w][!#$%&'*+\-/=?^_`{|}~\.\w]{0,}[!#$%&'*+\-/=?^_`{|}~\w]))[@]\w+([-.]\w+)*\.\w+([-.]\w+)*)$/ ||
                false
        )
    ) {
        return true
    }

    return false
}

export const filterEmptyFields = newForm => {
    const messyEmptyFields = Object.entries(newForm).filter(
        ([field, value]) => {
            return !value
        }
    )
    return messyEmptyFields.map(([field, value]) => field)
}
