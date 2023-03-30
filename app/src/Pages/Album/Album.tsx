import { useState, useRef } from 'react'
import { Block, Heading, Level, Icon, Button } from 'react-bulma-components'
import styled from 'styled-components'
import AutoCompleteCodes from '../../Components/AutoCompleteCodes/AutoCompleteCodes'
import Figure from '../../Figure'
import WithMenuBar from '../../Layouts/WithMenuBar'
import { Album } from '../../Stores/Album'
import { User, useUserStore } from '../../Stores/User'
import useSWRSubscription from 'swr/subscription'
import { toast, Slide } from 'react-toastify'

const ALBUM_SYNC_ACTIONS = {
  add: 'add_sticker',
  remove: 'remove_sticker',
  set: 'set_album'
} as const

type ALBUM_SYNC_ACTIONS_TYPES = typeof ALBUM_SYNC_ACTIONS[keyof typeof ALBUM_SYNC_ACTIONS]

const AlbumNameStyled = styled(Heading)`
  &.title {
    margin-bottom: 1rem;
  }
`

const SectionStyled = styled(Block)`
  display: grid;
  grid-template-columns: repeat(6, auto);
`

const SubstractIcon = styled(Icon)<{ active: boolean }>`
  border: 1px solid red;
  border-radius: 50%;
  border: ${({ active }) => active ? '1px solid white' : '1px solid red'};
  background-color: ${({ active }) => active ? 'red' : 'white'};
  color: ${({ active }) => active ? 'white !important' : ''}
`

const RepeatIcon = styled(Icon)<{ active: boolean }>`
  border: 1px solid #ffe08a;
  border-radius: 50%;
  border: ${({ active }) => active ? '1px solid white' : '1px solid #ffe08a'};
  background-color: ${({ active }) => active ? '#ffe08a' : 'white'};
  color: ${({ active }) => active ? 'white !important' : ''}
`

const FiltersContainerStyled = styled(Block)`
  width: 100%;
  z-index: 10;
  padding: 1rem;
  -webkit-box-shadow: -1px 13px 11px -7px rgba(153,137,153,1);
  -moz-box-shadow: -1px 13px 11px -7px rgba(153,137,153,1);
  box-shadow: -1px 13px 11px -7px rgba(153,137,153,1);
  &.block:not(:last-child) {
    margin-bottom: 0;
  }
`

const AlbumContatinerStyled = styled(Block)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: scroll;
  padding-top: 1rem;
  >div:last-child {
    margin-bottom: 3.8rem;
  }
`

const ContainerStyled = styled(Block)`
  overflow-y:hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
`

interface AlbumApiResponse {
  id: string
  stickers: Album
}

const keySocket = `ws://localhost:3000/api/album-sync`

const AlbumPage = (): JSX.Element => {
  const [isSubtractMode, setIsSubtractMode] = useState(false)
  const [isRepeatedMode, setIsRepeatedMode] = useState(false)
  const socketRef = useRef<WebSocket | null>(null)
  const [filterStickers, setFilterStickers] = useState<Album | null>(null)
  const { user } = useUserStore((state) => state)
  // TODO check this PR improving types on useSWRSubscription hook
  // https://github.com/vercel/swr/pull/2525
  // TODO(kevin): handle error from useSWRSubscription
  const { data: socketData } = useSWRSubscription(keySocket, (key, { next }) => {
    const socket = new WebSocket(`${key as string}?userEmail=${(user as User).email}`)
    socketRef.current = socket
    socket.addEventListener('message', (event) => {
      const dataParse = JSON.parse(event.data)
      const origin = dataParse.origin as string
      const action = dataParse.action as ALBUM_SYNC_ACTIONS_TYPES
      if (action !== 'set_album' && origin !== (user as User).email) {
        toast(`${origin} update album.`, { type: 'info', position: 'bottom-center', transition: Slide, autoClose: 2000 })
      }
      next(null, dataParse)
    })
    socket.addEventListener('error', (event) => {
      next(event.error)
    })
    return () => {
      socket.close()
    }
  })

  async function increaseOneOnRepeatSticker (code: string, number: string, isSubtractMode: boolean) {
    if (socketRef.current !== null) {
      socketRef.current.send(JSON.stringify({ action: isSubtractMode ? ALBUM_SYNC_ACTIONS.remove : ALBUM_SYNC_ACTIONS.add, code, number, origin: (user as User).email }))
    }
  }

  function filterAlbum (codeFilter: string | null) {
    if ((codeFilter !== null) && (socketData.data !== null)) {
      setFilterStickers({ [codeFilter]: socketData.data.stickers[codeFilter] })
    } else {
      setFilterStickers(null)
    }
  }

  if (typeof socketData !== 'undefined') {
    // const albumCache = (typeof socketData !== 'undefined') ? socketData.data.stickers : data?.data?.stickers // just for the first render
    const albumCache = socketData.data.stickers // just for the first render
    const list = filterStickers !== null ? filterStickers : albumCache

    return (
      <WithMenuBar>
        <ContainerStyled>
          <FiltersContainerStyled mb={0}>
            <AlbumNameStyled size={5} weight='semibold'>{socketData.data.name}</AlbumNameStyled>
            <AutoCompleteCodes
              onItemSelected={filterAlbum}
            />
            <Button
              color={isSubtractMode ? 'danger' : ''}
              size='small'
              mr={2}
              onClick={() => { setIsSubtractMode(prevValue => !prevValue) }}
            >
              <SubstractIcon
                color='danger'
                size='small'
                mr={2}
                active={isSubtractMode}
              >
                <i className='fa-solid fa-minus' />
              </SubstractIcon>
              <span>Restar</span>
            </Button>
            <Button
              color={isRepeatedMode ? 'warning' : ''}
              size='small'
              mr={2}
              onClick={() => { setIsRepeatedMode(prevValue => !prevValue) }}
            >
              <RepeatIcon
                color='warning'
                size='large'
                mr={2}
                active={isRepeatedMode}
              >
                <i className='fa-solid fa-repeat' />
              </RepeatIcon>
              <span>Repetidas</span>
            </Button>
            <Button color='' size='small'>
              <Icon
                color='link'
                size='small'
                mr={2}
                onClick={() => { setIsSubtractMode(prevValue => !prevValue) }}
              >
                <i className='fa-solid fa-ghost' />
              </Icon>
              <span>Faltantes</span>
            </Button>
          </FiltersContainerStyled>
          <AlbumContatinerStyled>
            {(list != null)
              ? Object.keys(list).map((code) => {
                return (
                  <Level.Side key={code}>
                    <Level.Item mt={1}>
                      <Heading>
                        {code}
                      </Heading>
                    </Level.Item>
                    <SectionStyled justifyContent='center'>
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
                    </SectionStyled>
                  </Level.Side>
                )
              })
              : null}
          </AlbumContatinerStyled>
        </ContainerStyled>
      </WithMenuBar>

    )
  }

  return null
}

export default AlbumPage
