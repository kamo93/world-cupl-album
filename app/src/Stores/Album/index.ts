import create from 'zustand'
import { missingStickers, getTotalStickers, numberRepeatedStickers } from '../../utils'

export interface Figure {
  value: string
  repeat: number
  isImportant: boolean
}

export interface Section {
  figures: Figure[]
}

export interface Album { [key: string]: Section }

export interface AlbumState {
  album?: Album
  id?: string
  name?: string
  setIdAlbum: (id: string) => void
  setAlbum: (album: Album) => void
  increaseSticker: (code: string, number: string) => void
  totalMissingStickerCount: () => number
  totalRepeatedStickerCount: () => number
  totalStickers: () => number
}

export const useAlbumStore = create<AlbumState>()((set, get) => ({
  album: undefined,
  idAlbum: undefined,
  name: '',
  setIdAlbum: (id: string) => set(() => ({ id })),
  setAlbumName: (name: string) => set(() => ({ name })),
  setAlbum: (album: Album) => set(() => ({ album })),
  increaseSticker: (code: string, number: string) => set((state) => {
    if (state.album != null) {
      const codeFigures = state.album[code].figures
      const newFiguresPerCode = codeFigures.map((sticker) => {
        if (sticker.value === number) {
          return { ...sticker, repeat: sticker.repeat + 1 }
        }
        return sticker
      })
      return {
        ...state,
        album: {
          ...state.album,
          [code]: {
            figures: [...newFiguresPerCode]
          }
        }
      }
    }
    return state
  }, true),
  totalMissingStickerCount: () => {
    const { album } = get()
    if (typeof album !== 'undefined') {
      return missingStickers(album)
    }
    return 0
  },
  totalRepeatedStickerCount: () => {
    const { album } = get()
    if (typeof album !== 'undefined') {
      return numberRepeatedStickers(album)
    }
    return 0
  },
  totalStickers: () => {
    const { album } = get()
    if (typeof album !== 'undefined') {
      return getTotalStickers(album)
    }
    return 0
  }

}))
