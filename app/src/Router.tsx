import { useEffect } from 'react'
import 'bulma/css/bulma.min.css'

import Login from './Pages/Login/Login'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { useSupabaseContext } from './Contexts/SupabaseContext'
import SelectOrCreateAlbum from './Pages/SelectOrCreateAlbum/SelectOrCreateAlbum'
import { useUserStore } from './Stores/User'
import { Album, useAlbumStore } from './Stores/Album'

import AlbumPage from './Pages/Album/Album'
import { AuthChangeEvent } from '@supabase/supabase-js'
import Cover from './Pages/Cover/Cover'
import WithMenuBar from './Layouts/WithMenuBar'
import Stats from './Pages/Stats/Stats'
import Settings from './Pages/Settings/Settings'
import customFetch, { CustomFetchError } from './customFetch'

interface User {
  email: string
  avatar: string
}

function ProtectRoute (): JSX.Element {
  const { user } = useUserStore((state) => state)

  console.log('here user', user)
  if (user === null) {
    return <Navigate to='/login' replace />
  }

  if (user === 'idle') {
    return <Navigate to='/' replace />
  }

  return <Outlet />
}

const validAuthEvents: AuthChangeEvent[] = ['SIGNED_IN', 'TOKEN_REFRESHED']

interface UserAlbumIds {
  email: string
  'albums-users': Array<{ album_id: string }>
}

interface AlbumApiResponse {
  data: {
    id: string
    stickers: Album
  }
}

interface InsertUserApiResponse {
  data: {
    avatar: string
    email: string
  }

}

function Router (): JSX.Element {
  const { supabase } = useSupabaseContext()
  const { addUser } = useUserStore((state) => state)
  const navigate = useNavigate()
  const { setAlbum, setIdAlbum } = useAlbumStore((state) => state)

  async function userHaveAlbum (user: User): Promise<void> {
    try {
      const { data } = await customFetch.get<{ data: UserAlbumIds }>({ url: `/api/user?userEmail=${user.email}` })
      console.log('data', data)
      const albumIds = data['albums-users']
      if (albumIds.length !== 0) {
        await getUserAlbumById(albumIds[0].album_id)
      } else {
        navigate('/protected/select-album')
      }
    } catch (e) {
      if ((e as CustomFetchError).statusCode === 404) {
        navigate('/protected/select-album')
      }
      console.warn(e)
    }
  }

  async function getUserAlbumById (albumId: string): Promise<void> {
    try {
      const { data } = await customFetch.get<AlbumApiResponse>({ url: `/api/albums/${albumId}` })
      if (data !== null) {
        setAlbum(data.stickers)
        setIdAlbum(data.id)
        navigate('/protected/user/album')
      }
    } catch (e) {
      const errApi = e as CustomFetchError
      if (errApi.statusCode === 404) {
        console.warn(errApi.message)
      }
      console.warn(e)
    }
  }

  async function getUserSession (): Promise<void> {
    try {
      const { error } = await supabase.auth.refreshSession()
      if (error != null) {
        throw new Error('Error refreshSession')
      }
    } catch (e) {
      console.warn(e)
    }
  }

  useEffect(() => {
    getUserSession()
  }, [])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log({ event, session })
        if (validAuthEvents.includes(event)) {
          if (session !== null) {
            const user = {
              email: session.user.user_metadata.email,
              avatar: session.user.user_metadata.avatar_url
            }
            const { data } = await customFetch.post<InsertUserApiResponse>({ url: '/api/user', body: { ...user } })
            if (data != null) {
              console.log('new user do something TODO')
            }
            addUser(data)
            await userHaveAlbum(data)
          }
        }
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/protected' element={<ProtectRoute />}>
        <Route path='/protected/select-album' element={<SelectOrCreateAlbum />} />
        <Route path='/protected/user' element={<Testlayout />}>
          <Route path='/protected/user/album' element={<AlbumPage />} />
          <Route path='/protected/user/stats' element={<Stats />} />
          <Route path='/protected/user/settings' element={<Settings />} />
        </Route>
      </Route>
      <Route path='*' element={<Cover />} />
    </Routes>
  )
}

function Testlayout (): JSX.Element {
  return (
    <WithMenuBar>
      <Outlet />
    </WithMenuBar>
  )
}

export default Router
