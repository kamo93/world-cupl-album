import { Fragment, useState, useEffect, useMemo } from 'react'
import { Block, Button, Form, Heading, Level } from 'react-bulma-components'
import { GlobalStyles } from './styles/GlobalStyles'
import 'bulma/css/bulma.min.css'
import Figure from './Figure'
import { ALBUM } from './Constants'

import AutoCompleteCodes from './Components/AutoCompleteCodes/AutoCompleteCodes'
import Login from './Pages/Login/Login'
import { Navigate, Outlet, redirect, Route, Routes, useNavigate } from 'react-router-dom'
import { useSupabaseContext } from './Contexts/SupabaseContext'
import SelectOrCreateAlbum from './Pages/SelectOrCreateAlbum/SelectOrCreateAlbum'
import { useUserStore } from './Stores/User'
import { useAlbumStore } from './Stores/Album'

import AlbumPage from './Pages/Album/Album'

const obj = {
  id: 'hola'
}

interface User {
  email: string
  avatar: string
}

interface UserState {
  user?: User
  addUser: (user: User) => void
}

// const useUserStore = create<UserState>()((set) => ({
//   user: undefined,
//   addUser: (user: User) => set(() => ({ user }))
// }))

interface Figure {
  value: string
  repeat: number
}

interface Section {
  figures: Figure[]
}

interface Album { [key: string]: Section }

interface AlbumState {
  album?: Album
  id?: string
  setIdAlbum: (id: string) => void
  setAlbum: (album: Album) => void
  increaseSticker: (code: string, number: string) => void
}

// const useAlbumStore = create<AlbumState>()((set) => ({
//   album: undefined,
//   idAlbum: undefined,
//   setIdAlbum: (id: string) => set(() => ({ id })),
//   setAlbum: (album: Album) => set(() => ({ album })),
//   increaseSticker: (code: string, number: string) => set((state) => {
//     if( state.album ) {
//       const codeFigures = state.album[code].figures;
//       const newFiguresPerCode = codeFigures.map((sticker) => {
//         if(sticker.value === number) {
//           return { ...sticker, repeat: sticker.repeat + 1 };
//         }
//         return sticker;
//       })
//       return {
//         ...state,
//         album: {
//           ...state.album,
//           [code]: {
//             figures: [...newFiguresPerCode]
//           }
//         }
//       }
//     }
//     return state
//   }, true)

// }))

function ProtectRoute () {
  console.log('protected')
  const { user } = useUserStore((state) => state)

  if (user == null) {
    return <Navigate to='/login' replace />
  }

  return <Outlet />
}

function RedirectIfUser () {
  return null
}

function App () {
  const { supabase } = useSupabaseContext()
  const { addUser } = useUserStore((state) => state)
  const navigate = useNavigate()
  const { setAlbum, setIdAlbum } = useAlbumStore((state) => state)

  async function userHaveAlbum (user: User) {
    try {
      const { error, data } = await supabase.from('users').select('email, albums-users (album_id)').in('email', [user?.email])
      if (error != null) {
        throw Error('select album' + error.details)
      }
      if (data.length > 0) {
        console.log('data from album id', data[0]['albums-users'].length)
        if (data[0]['albums-users'].length) {
          console.log('here 1')
          // @ts-expect-error
          const albumId = data[0]['albums-users'][0].album_id
          await getUserAlbumById(albumId)
        } else {
          console.log('here 2')
          // TODO this doesnt have any album yet
          navigate('/protected/select-album')
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }

  async function getUserAlbumById (albumId: string) {
    try {
      const { error, data } = await supabase.from('albums').select('id, stickers').in('id', [albumId])
      console.log({ error, data })
      if (error != null) {
        throw Error('create empty album - ' + error.details)
      }
      if (data.length > 0) {
        setAlbum(data[0].stickers)
        setIdAlbum(data[0].id)
        navigate('/protected/album')
      }
    } catch (e) {
      console.warn(e)
    }
  }

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('ever', event, session)
        if (event === 'SIGNED_IN') {
          if (session != null) {
            const user = {
              email: session.user.user_metadata.email,
              avatar: session.user.user_metadata.avatar_url
            }
            const { data } = await supabase.from('users').insert(user).select()
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
        <Route path='/protected/album' element={<AlbumPage />} />
        <Route path='/protected/select-album' element={<SelectOrCreateAlbum />} />
      </Route>
      <Route path='*' element={<RedirectIfUser />} />
    </Routes>
  )
}

function MainPage () {
  const { user, addUser } = useUserStore((state) => state)
  const { setAlbum, album, increaseSticker, setIdAlbum, id: idAlbum } = useAlbumStore((state) => state)

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN') {
          if (session) {
            const user = {
              email: session.user.user_metadata.email,
              avatar: session.user.user_metadata.avatar_url
            }
            const { data } = await supabase.from('users').insert(user).select()
            if (data) {
              console.log('new user do something TODO')
            }
            addUser(user)
          }
        }
      }
    )
    const channels = supabase.getChannels()
    console.log('channels', channels)

    const listenerAlbumsTable = supabase
      .channel('public:albums')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'albums' },
        updateLocalAlbum
      ).subscribe()
    console.log('hereee')

    return () => {
      console.log('unsub')
      authListener.subscription.unsubscribe()
      // listenerAlbumsTable.unsubscribe()
    }
  }, [])

  function updateLocalAlbum (payload: any) {
    console.log('change occurs', payload)
    if (payload.new) {
      setAlbum(payload.new.stickers)
    }
  }

  async function updateAlbum () {
    try {
      const res = await supabase.from('albums').update({ stickers: album }).match({ id: idAlbum })
      if (res) {
        console.log(res)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  async function openGmailOauth () {
    try {
      const res = await supabase.auth.signInWithOAuth({ provider: 'google', options: { scopes: 'email profile' } })
      if (res.error) {
        throw Error('signInWithOAuth error - ' + res.error.name)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  async function createAlbum (name: string) {
    try {
      const { data, error } = await supabase.from('albums').insert({ stickers: ALBUM, name }).select()
      if (error) {
        throw Error('create empty album - ' + error.details)
      }
      if (data.length) {
        const newAlbum = data[0]
        const { error } = await supabase.from('albums-users').insert({ email: user?.email, album_id: newAlbum.id }).select()
        if (error) {
          throw Error('album-user error - ' + error.details)
        }
        setAlbum(newAlbum.stickers)
        setIdAlbum(newAlbum.id)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  async function getUserAlbumById (albumId: string) {
    try {
      const { error, data } = await supabase.from('albums').select('id, stickers').in('id', [albumId])
      console.log({ error, data })
      if (error) {
        throw Error('create empty album - ' + error.details)
      }
      if (data.length) {
        setAlbum(data[0].stickers)
        setIdAlbum(data[0].id)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  async function userHaveAlbum () {
    try {
      const { error, data } = await supabase.from('users').select('email, albums-users (album_id)').in('email', [user?.email])
      if (error) {
        throw Error('select album' + error.details)
      }
      if (data.length) {
        if (data[0]['albums-users']) {
          // @ts-expect-error
          const albumId = data[0]['albums-users'][0].album_id
          await getUserAlbumById(albumId)
        } else {
        // TODO this doesnt have any album yet
        }
      }
    } catch (e) {
      console.warn(e)
    }
  }

  async function increaseOneOnRepeatSticker (code: string, number: string, isSubtractMode: boolean) {
    if (album != null) {
      const codeFigures = album[code].figures
      const newFiguresPerCode = codeFigures.map((sticker) => {
        if (sticker.value === number) {
          let newValue = 0
          if (isSubtractMode && sticker.repeat > 0) {
            newValue = sticker.repeat - 1
          }
          if (!isSubtractMode) {
            newValue = sticker.repeat + 1
          }
          return { ...sticker, repeat: newValue }
        }
        return sticker
      })
      try {
        const { data, error } = await supabase
          .from('albums')
          .update(
            {
              stickers:
              {
                ...album,
                [code]: {
                  figures: [...newFiguresPerCode]
                }
              }
            }
          ).match({ id: idAlbum }).select()
        if (!error) {
          console.log(data)
          setAlbum(data[0].stickers)
        }
      } catch (e) {
        console.warn(e)
      }
    }
  }

  async function joinAlbum () {
    try {
      console.log(user?.email, albumSelected)
      const { error } = await supabase.from('albums-users').insert({ email: user?.email, album_id: albumSelected }).select()
      if (error) {
        throw Error('album-user error - ' + error.details)
      }
      const { data, error: errGetAlbum } = await supabase.from('albums').select('stickers').match({ id: albumSelected })
      if (errGetAlbum) {
        throw Error('get album - ' + errGetAlbum.details)
      }
      if (data.length) {
        setAlbum(data[0].stickers)
        setIdAlbum(albumSelected)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  async function getAllAlbums () {
    try {
      const { error, data } = await supabase.from('albums').select('id, name')
      if (error) {
        throw Error('getAllalbums error - ' + error.details)
      }
      if (data.length) {
        console.log(data)
        setAlbums(data)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  const [albums, setAlbums] = useState<Array<{ id: string, name: string }>>()
  const [albumSelected, setAlbumSelected] = useState('')
  const [filterStickers, setFilterStickers] = useState<Album | null>()
  const [isSubtractMode, setIsSubtractMode] = useState(false)

  function filterAlbum (codeFilter: string) {
    if (codeFilter && (album != null)) {
      setFilterStickers({ [codeFilter]: album[codeFilter] })
    } else {
      setFilterStickers(null)
    }
  }

  function showJustRepeated () {
    if (album != null) {
      let res: Album = {}
      Object.keys(album).forEach((code) => {
        const figuresRepeated = album[code].figures.filter(({ repeat }) => repeat > 1)
        if (figuresRepeated.length > 0) {
          res = {
            ...res,
            [code]: {
              figures: [...figuresRepeated]
            }
          }
        }
      })
      setFilterStickers(res)
    }
  }

  function removeFilters () {
    setFilterStickers(null)
  }

  function toggleSubtractMode () {
    setIsSubtractMode(prevValue => !prevValue)
  }

  function shareRepeated () {
    let res = 'Estas son mis repetidas'
    if (album != null) {
      Object.keys(album).forEach((code) => {
        const figuresRepeated = album[code].figures.filter(({ repeat }) => repeat > 1).map(({ value }) => value)
        if (figuresRepeated.length > 0) {
          console.log(res, figuresRepeated, `${res}${code}: ${figuresRepeated.join(',')}`)
          res = `${res}\n${code}: ${figuresRepeated.join(',')}`
        }
      })
    }
    console.log('share this in whatsapp', res)
  }

  const list = useMemo(() => {
    return (filterStickers != null) ? filterStickers : album
  }, [album, filterStickers])

  console.log('album', album)
  console.log('filterStickers', filterStickers)
  console.log('id album', idAlbum)

  return (
    <>
      <Button onClick={() => { openGmailOauth() }}>Gmail</Button>
      <Button onClick={() => { createAlbum(`test-name-${crypto.randomUUID()}`) }}>Crear album</Button>
      <Button onClick={() => { getAllAlbums() }}>Dummy traer albums</Button>
      <Button onClick={() => { userHaveAlbum() }}>Revisar si usario tinen album</Button>
      <Button onClick={() => { showJustRepeated() }}>Ver repetidas</Button>
      <Button onClick={() => { removeFilters() }}>Remover filtros</Button>
      <Button onClick={() => { shareRepeated() }}>Listar repetidas</Button>
      <Button onClick={() => { toggleSubtractMode() }}>Modo restar</Button>
      <GlobalStyles />
      {
        (albums != null) && albums.length > 1
          ? <Form.Field>
            <Form.Control>
              <Form.Label>Eligue un album existente</Form.Label>
              <Form.Select onChange={(ev: React.ChangeEvent<HTMLSelectElement>) => { setAlbumSelected(ev.target.value) }}>
                <option selected value='' disabled>Selecciona una opcion</option>
                {albums.map(({ name, id }) => (<option key={id} value={id}>{name}</option>))}
              </Form.Select>
            </Form.Control>
            </Form.Field>
          : null
      }
      <AutoCompleteCodes
        onItemSelected={filterAlbum}
      />
      <Button disabled={!albumSelected} onClick={() => { joinAlbum() }}>Unirse al album seleccionado</Button>
      <Heading size={4}>Mode {isSubtractMode ? 'restar' : 'sumar'}</Heading>
      <Block>
        {(list != null)
          ? Object.keys(list).map((code) => {
            return (
              <Level.Side key={code}>
                <Level.Item>
                  <Heading>
                    {code}
                  </Heading>
                </Level.Item>
                <Block justifyContent='center' display='flex' flexWrap='wrap'>
                  {list[code].figures.map(({ value, repeat }) => {
                    return (
                      <Figure
                        key={`${code}-${value}`}
                        albumNumber={value}
                        timesRepeat={repeat}
                        onClick={() => { increaseOneOnRepeatSticker(code, value, isSubtractMode) }}
                      />
                    )
                  })}
                </Block>
              </Level.Side>
            )
          })
          : null}
      </Block>
    </>
  )
}

export default App
