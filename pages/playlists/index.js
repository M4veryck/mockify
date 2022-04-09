import { useEffect, useLayoutEffect, useState } from 'react'
import { NavBarContextConsumer } from '../../components/navBarContext'

export default function Playlists({ authorized }) {
    // const { authToken } = NavBarContextConsumer()
    const authToken = localStorage.getItem('userToken')

    return authToken ? <h1>Hi!!!</h1> : <h1>You are not allowed</h1>
}
