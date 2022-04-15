import { useRouter } from 'next/router'

import { useState } from 'react'
import { createContext, useContext } from 'react'
import usePlaylists from './hooks/usePlaylists'

const PlaylistsContext = createContext()

function PlaylistsContextProvider({ children }) {
    const router = useRouter()
    const { playlistsState, playlistsDispatcher } = usePlaylists(
        router.query._id
    )

    const values = {
        playlistsState,
        playlistsDispatcher,
    }

    return (
        <PlaylistsContext.Provider value={values}>
            {children}
        </PlaylistsContext.Provider>
    )
}

function PlaylistsContextConsumer() {
    const context = useContext(PlaylistsContext)

    if (!context) {
        console.error('Context Error')
    }

    return context
}

export { PlaylistsContextProvider, PlaylistsContextConsumer }
