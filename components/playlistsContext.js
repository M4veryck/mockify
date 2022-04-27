// import { useRouter } from 'next/router'

// import { useState, useEffect } from 'react'
// import { createContext, useContext } from 'react'
// import usePlaylists from './hooks/usePlaylists'
// import { getAllData } from './playlists/CRUD'

// const PlaylistsContext = createContext()

// function PlaylistsContextProvider({ children }) {
//     const router = useRouter()
//     const { playlistsState, playlistsDispatcher } = usePlaylists()
//     const [toPlaylists, setToPlaylists] = useState(false)

//     useEffect(() => {
//         ;(async () => {
//             const isLoggedIn = await getAllData(playlistsDispatcher)
//             if (isLoggedIn) {
//                 setToPlaylists(true)
//                 return
//             }
//             setToPlaylists(false)
//         })()
//     }, [router])

//     function logOff() {
//         localStorage.removeItem('userToken')
//         setToPlaylists(false)
//         router.push('/')
//     }

//     const values = {
//         playlistsState,
//         playlistsDispatcher,
//         toPlaylists,
//         logOff,
//     }

//     return (
//         <PlaylistsContext.Provider value={values}>
//             {children}
//         </PlaylistsContext.Provider>
//     )
// }

// function PlaylistsContextConsumer() {
//     const context = useContext(PlaylistsContext)

//     return context
// }

// export { PlaylistsContextProvider, PlaylistsContextConsumer }
