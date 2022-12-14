import { useEffect, useState } from 'react'
import { Block, Heading } from 'react-bulma-components'
import { useSupabaseContext } from '../../Contexts/SupabaseContext'
import { useAlbumStore } from '../../Stores/Album'
import { User } from '../../Stores/User'
// import { useUserStore } from "../../Stores/User";

function Settings (): JSX.Element {
  const albumId = useAlbumStore((state) => state.id)
  const [users, setUsers] = useState<User[]>([])
  // const user = useUserStore((state) => state.user)
  const { supabase } = useSupabaseContext()

  useEffect(() => {
    const fetchUsersXAlbumId = async () => {
      const { data, error } = await supabase.from('albums-users').select('*').eq('album_id', albumId)
      console.log(data, error)
      if (error != null) return null
      if (data.length > 0) {
        setUsers(data as User[])
        for(let i = 0; i <data.length; i++) {
          const { data: albumsData, error } = await supabase.from('albums').select('name, owner').eq('id', data[i].album_id)
          console.log(albumsData, error)
          if (error != null) return null
        }
      }
    }

    fetchUsersXAlbumId()
  }, [])

  return (
    <Block>
      <div>
      <Heading>Este album lo estas completando con:</Heading>
      <ul>
        {users.map((user) => {
          return (
            <div key={user.email}>{user.email}</div>
          )
        })}
      </ul>
      </div>
      <div>
      <Heading>Otros albums que estas completando:</Heading>
      <ul>
        {users.map((user) => {
          return (
            <div key={user.email}>{user.email}</div>
          )
        })}
      </ul>
      </div>
    </Block>
  )
}

export default Settings
