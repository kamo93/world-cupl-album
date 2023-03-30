import { useState } from 'react'
import { Block, Button, Heading, Icon, Modal } from 'react-bulma-components'
import { useAlbumStore } from '../../Stores/Album'
import { useUserStore, User } from '../../Stores/User'
import customFetch from '../../customFetch'
import styled from 'styled-components'
import useSWR, { useSWRConfig } from 'swr'
import useSWRMutate from 'swr/mutation'
import useSWRImmutable from 'swr/immutable'
import ChangeAlbumModal from './ChangeAlbumModal'
import { useNavigate } from 'react-router-dom'
import PageLoader from '../../Components/PageLoader/PageLoader'

interface GetAlbumsByEmail {
  id: string
  name: string
  selected: boolean
}

const ContainerStyled = styled(Block)`
  margin-top: 50px;
`

const AlbumsContainerStyled = styled.div`
  margin: 12px;
`

const EmailContainerStyled = styled.div`
  border: 1px solid blue;
  margin: 46px 10px 10px;
  padding: 6px 8px;
  border-radius: 8px;
`

const AlbumItemStyled = styled.li`
  padding: 12px 10px;
  border: 1px solid #3e8ed0;
  color: #3e8ed0;
  margin: 8px 0px;
  border-radius: 8px;
  display: flex;
  flex: row;
  justify-content: space-between;
  cursor: pointer;
  &.selected {
    background-color: #3e8ed0;
    border-color: #dcdcdc;
    color: #dcdcdc;
  }
`

const IconStyled = styled(Icon)`
  color: #dcdcdc;
`

async function fetcher(url: string) {
  return await customFetch.get<{ data: GetAlbumsByEmail[] | null }>({ url })
}

async function fetcherUser(url: string) {
  return await customFetch.get<{ data: string[] | null }>({ url })
}

// async function get (url: string, { arg: userEmail }: { arg: string }) {
//   console.log('url', url)
//   return await customFetch.get<{ data: string[] | null }>({ url})
// }

async function updateAlbumSelected(url: string, { arg: { albumIdSelected, userEmail } }: { arg: { albumIdSelected: string, userEmail: string } }) {
  return await customFetch.put<{ data: any }>({ url: `${url}/${albumIdSelected}`, body: { userEmail } })
}

const keySocket = `ws://localhost:3000/api/album-sync`
function Settings(): JSX.Element {
  const albumId = useAlbumStore((state) => state.id)
  const name = useAlbumStore((state) => state.name)
  const { 
    mutate: cacheMutate,
    cache
  } = useSWRConfig()

  console.log('cache',cache)
  const { trigger, isMutating } = useSWRMutate('/api/albums', updateAlbumSelected)
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [albumIdSelected, setAlbumIdSelected] = useState('')
  console.count('settings')
  const user = useUserStore((state) => state.user)
  const { data: responseAlbum, isLoading, error, mutate } = useSWRImmutable(`/api/albums/user/${(user as User).email}`, fetcher, { fallback: <div>....hola cargando</div> })
  const { data: responseUser, isLoading: isLoadingUser, error: errorUser, mutate: userMutate } = useSWRImmutable(`/api/users/album/${albumId as string}`, fetcherUser)
  console.log('api/usesr/albums', { responseUser, isLoadingUser, errorUser })

  const openChangeAlbumSelectedModal = (id: string) => {
    setAlbumIdSelected(id)
    setShowModal(true)
  }

  const setAlbumSelected = async (albumIdSelected: string): Promise<void> => {
    try {
      const { data } = await trigger({ userEmail: (user as User).email, albumIdSelected })
      console.log('data', data)
      if (data) {
        setShowModal(false)
        console.log()
        const mutateData = responseAlbum.data.map(({ name, id }) => ({ name, id, selected: id === albumIdSelected }))
        mutate({ data: mutateData }, { revalidate: false })
        // const mute = await cacheMutate('/api/album')
        const mute = await cacheMutate(keySocket)
        // console.log('mute',mute)

      }
    } catch (e) {
      console.log(e)
    }
  }

  if (isLoading || isLoadingUser) {
    return <PageLoader />
  }

  if (typeof responseUser !== 'undefined' && (typeof responseAlbum !== 'undefined')) {
    const { data: albumData } = responseAlbum
    const { data: userData } = responseUser
    return (
      <>
        <ChangeAlbumModal
          openModal={showModal}
          album={{ name: name as string, id: albumIdSelected }}
          hanldleOnClose={() => setShowModal(false)}
          handleSelectNewAlbum={setAlbumSelected}
          isLoading={isMutating}
        />
        <ContainerStyled>
          <AlbumsContainerStyled>
            <Heading renderAs='h3' size={5}>Otros albums que estas completando:</Heading>
            <ul>
              {(albumData != null)
                ? albumData.map(({ name, id, selected }) => {
                  return (
                    <AlbumItemStyled
                      key={id}
                      className={`${selected ? 'selected' : ''}`}
                      onClick={() => openChangeAlbumSelectedModal(id)}
                    >
                      <div>{name}</div>
                      {selected
                        ? <IconStyled>
                          <i className='fa-regular fa-circle-check' />
                        </IconStyled>
                        : null}
                    </AlbumItemStyled>
                  )
                })
                : null}
            </ul>
          </AlbumsContainerStyled>
          <EmailContainerStyled>
            <Heading renderAs='h3' size={5}>Este album lo estas completando con:</Heading>
            <ul>
              {(userData != null)
                ? userData.map((email) => {
                  return (
                    <li key={email}>{email}</li>
                  )
                })
                : null}
            </ul>
          </EmailContainerStyled>
        </ContainerStyled>
      </>
    )
  }

  return null
}

export default Settings
