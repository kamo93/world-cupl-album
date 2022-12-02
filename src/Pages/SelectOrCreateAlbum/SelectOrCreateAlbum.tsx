import { useEffect, useState } from 'react'
import { Form, Block, Heading, Button } from 'react-bulma-components'
import { useNavigate } from 'react-router-dom'
import { ALBUM } from '../../Constants'
import { useSupabaseContext } from '../../Contexts/SupabaseContext'
import { useAlbumStore } from '../../Stores/Album'
import { useUserStore } from '../../Stores/User'

function SelectOrCreateAlbum () {
  const { setAlbum, setIdAlbum } = useAlbumStore((state) => state)
  const { supabase } = useSupabaseContext()
  const [albums, setAlbums] = useState<Array<{ id: string, name: string }>>()
  const [albumSelected, setAlbumSelected] = useState('')
  const user = useUserStore((state) => state.user)
  const navigate = useNavigate()

  async function getAllAlbums () {
    try {
      const { error, data } = await supabase.from('albums').select('id, name')
      if (error != null) {
        throw Error('getAllalbums error - ' + error.details)
      }
      if (data.length > 0) {
        console.log('getAllAlbums', data)
        setAlbums(data)
      }
    } catch (e) {
      console.warn(e)
    }
  }

  async function createAlbum (name: string) {
    try {
      const { data, error } = await supabase.from('albums').insert({ stickers: ALBUM, name }).select()
      if (error != null) {
        throw Error('create empty album - ' + error.details)
      }
      if (data.length > 0) {
        console.log('user', user)
        const newAlbum = data[0]
        const { error } = await supabase.from('albums-users').insert({ email: user?.email, album_id: newAlbum.id }).select()
        if (error != null) {
          throw Error('album-user error - ' + error.details)
        }
        setAlbum(newAlbum.stickers)
        setIdAlbum(newAlbum.id)
        navigate('/protected/album')
      }
    } catch (e) {
      console.warn(e)
    }
  }

  function handlerOnSubmit (ev: React.SyntheticEvent) {
    ev.preventDefault()
    const target = ev.target as typeof ev.target & {
      albumName: { value: string }
    }
    const albumName = target.albumName.value // typechecks!
    createAlbum(albumName)
  }

  useEffect(() => {
    getAllAlbums()
  }, [])

  return (
    <Block>
      {
        (albums == null) || (albums.length === 0)
          ? <Block>
            <Heading size={2}>Crear album</Heading>
            <form onSubmit={handlerOnSubmit}>
              <Form.Field>
                <Form.Control>
                  <Form.Label>Nombre del album</Form.Label>
                  <Form.Input type='text' name='albumName' />
                </Form.Control>
              </Form.Field>
              <Form.Control>
                <Button submit>Confirmar</Button>
              </Form.Control>
            </form>
          </Block>
          : null
      }
      {
        (albums != null) && albums.length > 1
          ? <Block>
            <Form.Field>
              <Form.Control>
                <Form.Label>Eligue un album existente</Form.Label>
                <Form.Select onChange={(ev: React.ChangeEvent<HTMLSelectElement>) => { setAlbumSelected(ev.target.value) }}>
                  <option selected value='' disabled>Selecciona una opcion</option>
                  {albums.map(({ name, id }) => (<option value={id} key={id}>{name}</option>))}
                </Form.Select>
              </Form.Control>
            </Form.Field>
          </Block>
          : null
      }
    </Block>
  )
}

export default SelectOrCreateAlbum
