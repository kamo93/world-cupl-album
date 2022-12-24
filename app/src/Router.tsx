import { useEffect } from 'react'
import 'bulma/css/bulma.min.css'
import Figure from './Figure'

import Login from './Pages/Login/Login'
import { Navigate, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import { useSupabaseContext } from './Contexts/SupabaseContext'
import SelectOrCreateAlbum from './Pages/SelectOrCreateAlbum/SelectOrCreateAlbum'
import { useUserStore } from './Stores/User'
import { useAlbumStore } from './Stores/Album'

import AlbumPage from './Pages/Album/Album'
import { AuthChangeEvent } from '@supabase/supabase-js'
import Cover from './Pages/Cover/Cover'
import WithMenuBar from './Layouts/WithMenuBar'
import Stats from './Pages/Stats/Stats'
import Settings from './Pages/Settings/Settings'

interface User {
  email: string
  avatar: string
}

interface Figure {
  value: string
  repeat: number
}

interface Section {
  figures: Figure[]
}

interface Album { [key: string]: Section }

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

function Router (): JSX.Element {
  const { supabase } = useSupabaseContext()
  const { addUser } = useUserStore((state) => state)
  const navigate = useNavigate()
  const { setAlbum, setIdAlbum } = useAlbumStore((state) => state)

  async function userHaveAlbum (user: User): Promise<void> {
    try {
      const res = await fetch(`/api/users?userEmail=${user.email}`, { method: 'GET' })
      const { data, error } = await res.json()
      if (error !== null) {
        throw Error(`select album ${error.details}`)
      }
      if (data.length > 0) {
        console.log('data from album id', data[0]['albums-users'].length)
        if (data[0]['albums-users'].length) {
          const albumId = data[0]['albums-users'][0].album_id
          await getUserAlbumById(albumId)
        } else {
          // TODO this doesnt have any album yet
          navigate('/protected/select-album')
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }

  async function getUserAlbumById (albumId: string): Promise<void> {
    try {
      const res = await fetch(`/api/album?albumId=${albumId}`, { method: 'GET' })
      const { data, error } = await res.json()
      // const { error, data } = await supabase.from('albums').select('id, stickers').in('id', [albumId])
      if (error != null) {
        throw Error('create empty album - ' + error.details)
      }
      if (data.length > 0) {
        setAlbum(data[0].stickers)
        setIdAlbum(data[0].id)
        navigate('/protected/user/album')
      }
    } catch (e) {
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
        if (validAuthEvents.includes(event)) {
          if (session != null) {
            const user = {
              email: session.user.user_metadata.email,
              avatar: session.user.user_metadata.avatar_url
            }
            // const { data } = await supabase.from('users').insert(user).select()
            const res = await fetch('/api/users', {
              method: 'POST',
              body: { ...user }
            })
            const data = await res.json()
            if (data != null) {
              console.log('new user do something TODO')
            }
            addUser(user)
            await userHaveAlbum(user)
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
