import { Form, Block, Heading, Button, Section } from 'react-bulma-components'
import { useNavigate } from 'react-router-dom'
import { ALBUMS } from '../../../../share/constants'
import customFetch from '../../customFetch'
import { Album, useAlbumStore } from '../../Stores/Album'
import { User, useUserStore } from '../../Stores/User'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import PageLoader from '../../Components/PageLoader/PageLoader'
import styled from 'styled-components'

interface AlbumsApiResponse {
  data: Array<{
    id: string
    name: string
  }>
}

interface AlbumsPostApiResponse {
  data?: {
    stickers: Album
    name: string
    owner: string
    album_type_id: string
    id: string
  }
}

const StyledContainer = styled(Block)`
  max-height: 100vh;
  height: 100vh;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
`

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-bottom: 40px;
  align-items: stretch;
  flex: 1;
`

const StyledFieldContainer = styled.div`
  display: flex;
  flex-direction: column;
  
`

async function fetcher (url: string) {
  return await customFetch.get<AlbumsApiResponse>({ url })
}

async function fetcherPost (url: string, { arg }: { arg: { name: string, email: string, albumTypeId: string } }) {
  return await customFetch.post<AlbumsPostApiResponse>({ url, body: { name: arg.name, email: arg.email, albumTypeId: arg.albumTypeId } })
}

function SelectOrCreateAlbum (): JSX.Element {
  const { setIdAlbum } = useAlbumStore((state) => state)
  const { isLoading } = useSWR<AlbumsApiResponse>('/api/albums', fetcher)
  const { trigger, isMutating } = useSWRMutation<AlbumsPostApiResponse, { error: string }, '/api/album', { name: string, email: string, albumTypeId: string }, AlbumsPostApiResponse>('/api/album', fetcherPost)
  // const [albums, setAlbums] = useState<Array<{ id: string, name: string }>>()
  // const [albumSelected, setAlbumSelected] = useState('')
  const user = useUserStore((state) => state.user)
  const navigate = useNavigate()

  // async function getAllAlbums (): Promise<void> {
  //   try {
  //     const { data } = await customFetch.get<AlbumsApiResponse>({ url: `/api/albums` })
  //     if (error != null) {
  //       throw Error('getAllalbums error - ' + error.details)
  //     }
  //     if (data.length > 0) {
  //       console.log('getAllAlbums', data)
  //       setAlbums(data)
  //     }
  //   } catch (e) {
  //     console.warn(e)
  //   }
  // }

  async function createAlbum (name: string, albumTypeId: string): Promise<void> {
    try {
      const { data } = await trigger({ name, email: (user as User).email, albumTypeId })
      if (data !== null && typeof data !== 'undefined') {
        setIdAlbum(data.id)
        navigate('/protected/user/album')
      }
    } catch (e) {
      console.warn(e)
    }
  }

  function handlerOnSubmit (ev: React.SyntheticEvent) {
    ev.preventDefault()
    const target = ev.target as typeof ev.target & {
      albumName: { value: string }
      albumTypeId: { value: string }
    }
    const albumName = target.albumName.value // typechecks!
    const albumTypeId = target.albumTypeId.value
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    createAlbum(albumName, albumTypeId)
  }

  // useEffect(() => {
  //   getAllAlbums()
  // }, [])

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <StyledContainer>
      <Heading pt={6} size={2}>Crear album</Heading>
      <Section>
        <p>
          Para la creacion de tu album debes escoger el tipo de album y poner un nombre al mismo.
        </p>
      </Section>
      <StyledForm onSubmit={handlerOnSubmit}>
        <StyledFieldContainer>
          <Form.Field>
            <Form.Label htmlFor='albumTypeId'>Selecciona el album que vas a completar</Form.Label>
            <Form.Control>
              <Form.Select name='albumTypeId'>
                {
                  ALBUMS.map(({ name, id }) => {
                    return <option value={id} key={id}>{name}</option>
                  })
                }
              </Form.Select>
            </Form.Control>
          </Form.Field>
          <Form.Field>
            <Form.Control>
              <Form.Label htmlFor='albumName'>Nombre del album</Form.Label>
              <Form.Input type='text' name='albumName' />
            </Form.Control>
          </Form.Field>
        </StyledFieldContainer>
        <Form.Control>
          <Button
            submit
            fullwidth
            color='info'
            outlined
            loading={isMutating}
          >
            Confirmar
          </Button>
        </Form.Control>
      </StyledForm>
    </StyledContainer>
  )

  // return (
  //   <Block>
  //     {
  //       (da == null) || (albums.length === 0)
  //         ? <Block>
  //             <Heading size={2}>Crear album</Heading>
  //             <form onSubmit={handlerOnSubmit}>
  //               <Form.Field>
  //                 <Form.Control>
  //                   <Form.Label>Nombre del album</Form.Label>
  //                   <Form.Input type='text' name='albumName' />
  //                 </Form.Control>
  //               </Form.Field>
  //               <Form.Control>
  //                 <Button submit>Confirmar</Button>
  //               </Form.Control>
  //             </form>
  //           </Block>
  //         : null
  //     }
  //     {
  //       (albums != null) && albums.length > 1
  //         ? <Block>
  //           <Form.Field>
  //             <Form.Control>
  //               <Form.Label>Eligue un album existente</Form.Label>
  //               <Form.Select onChange={(ev: React.ChangeEvent<HTMLSelectElement>) => { setAlbumSelected(ev.target.value) }}>
  //                 <option selected value='' disabled>Selecciona una opcion</option>
  //                 {albums.map(({ name, id }) => (<option value={id} key={id}>{name}</option>))}
  //               </Form.Select>
  //             </Form.Control>
  //           </Form.Field>
  //         </Block>
  //         : null
  //     }
  //   </Block>
  // )
}

export default SelectOrCreateAlbum
