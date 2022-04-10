export async function getAllPlaylists(updateUserAndPlaylists) {
    try {
        const userToken = localStorage.getItem('userToken')

        const res = await fetch('/api/playlists', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
        })

        if (res.status === 403) {
            router.push('/login')
            return
        }

        const data = await res.json()
        updateUserAndPlaylists(data)
    } finally {
        return null
    }
}

export async function addPlaylist(
    addFormData,
    userAndPlaylists,
    updateUserAndPlaylists
) {
    try {
        const userToken = localStorage.getItem('userToken')
        const res = await fetch('/api/playlists', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${userToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: addFormData.name,
                userId: userAndPlaylists.userInfo.userId,
            }),
        })

        getAllPlaylists(updateUserAndPlaylists)

        if (res.ok) {
            return true
        }
    } catch (err) {
        console.log(err)
        return false
    }
}
