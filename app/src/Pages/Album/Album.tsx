import { useRef, useState } from 'react'
import { Button, Icon } from 'react-bulma-components'
import { Slide, toast } from 'react-toastify'
import useSWRSubscription from 'swr/subscription'
import AutoCompleteCodes from '../../Components/AutoCompleteCodes/AutoCompleteCodes'
import { Album } from '../../Stores/Album'
import { User, useUserStore } from '../../Stores/User'
import { AlbumNameStyled, ContainerStyled, FiltersContainerStyled, RepeatIcon, ScrollAlbumStyled, SubstractIcon } from './StyledComponents'
import AlbumComponent from './AlbumComponent'
import { repeatedStickers } from '../../utils'

const ALBUM_SYNC_ACTIONS = {
  add: 'add_sticker',
  remove: 'remove_sticker',
  set: 'set_album'
} as const

interface SocketData {
  data: {
    name: string
    stickers: Album
  }
  origin: string
  action: ALBUM_SYNC_ACTIONS_TYPES
}

type ALBUM_SYNC_ACTIONS_TYPES = typeof ALBUM_SYNC_ACTIONS[keyof typeof ALBUM_SYNC_ACTIONS]

const keySocket = 'ws://localhost:3000/api/album-sync'

const AlbumPage = () => {
  const [isSubtractMode, setIsSubtractMode] = useState(false)
  const [isRepeatedMode, setIsRepeatedMode] = useState(false)
  const [filterStickers, setFilterStickers] = useState<Album | null>(null)

  const socketRef = useRef<WebSocket | null>(null)

  const { user } = useUserStore((state) => state)
  // TODO check this PR improving types on useSWRSubscription hook
  // https://github.com/vercel/swr/pull/2525
  // TODO(kevin): handle error from useSWRSubscription
  const { data } = useSWRSubscription<SocketData, { err: string }, string>(keySocket, (key, { next }) => {
    console.log('user', user)
    const socket = new WebSocket(`${key}?userEmail=${(user as User).email}`)
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
      next({ err: (event as ErrorEvent).message })
    })
    return () => {
      socket.close()
    }
  })
  const socketData = data

  function increaseOneOnRepeatSticker (code: string, number: string, isSubtractMode: boolean) {
    if (socketRef.current !== null) {
      socketRef.current.send(JSON.stringify({ action: isSubtractMode ? ALBUM_SYNC_ACTIONS.remove : ALBUM_SYNC_ACTIONS.add, code, number, origin: (user as User).email }))
    }
  }

  function filterAlbum (codeFilter: string | null) {
    if ((codeFilter !== null) && (typeof socketData !== 'undefined')) {
      setFilterStickers({ [codeFilter]: socketData.data.stickers[codeFilter] })
    } else {
      setFilterStickers(null)
    }
  }

  function setRepeatedAlbum () {
    if (isRepeatedMode) {
      setIsRepeatedMode(false)
      setFilterStickers(null)
    } else {
      if (typeof socketData === 'undefined') return
      const albumCache = socketData.data.stickers
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (albumCache) {
        setIsRepeatedMode(prevValue => !prevValue)
        setFilterStickers(repeatedStickers(albumCache))
      }
    }
  }

  if (typeof socketData !== 'undefined') {
    // const albumCache = (typeof socketData !== 'undefined') ? socketData.data.stickers : data?.data?.stickers // just for the first render
    const albumCache = socketData.data.stickers // just for the first render
    const list = filterStickers !== null ? filterStickers : albumCache

    return (
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
              $isActive={isSubtractMode}
            >
              <i className='fa-solid fa-minus' />
            </SubstractIcon>
            <span>Restar</span>
          </Button>
          <Button
            color={isRepeatedMode ? 'warning' : ''}
            size='small'
            mr={2}
            onClick={setRepeatedAlbum}
          >
            <RepeatIcon
              color='warning'
              size='large'
              mr={2}
              $isActive={isRepeatedMode}
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
        <ScrollAlbumStyled>
          <AlbumComponent
            albumList={list}
            increaseOneOnRepeatSticker={increaseOneOnRepeatSticker}
            isSubtractMode={isSubtractMode}
          />
        </ScrollAlbumStyled>
      </ContainerStyled>
    )
  }

  return null
}

export default AlbumPage
