import create from 'zustand'

export interface Figure {
  value: string
  repeat: number
}

export interface Section {
  figures: Figure[]
}

export interface Album { [key: string]: Section }

export interface AlbumState {
  album?: Album
  id?: string
  setIdAlbum: (id: string) => void
  setAlbum: (album: Album) => void
  increaseSticker: (code: string, number: string) => void
  totalMissingStickerCount: () => number
  totalRepeatedStickerCount: () => number
}

function repeatedStickers (album: Album): number {
  let count: number = 0
  Object.keys(album).forEach((code) => {
    album[code].figures
      .filter(({ repeat }) => repeat > 1)
      .forEach(({ repeat }) => { count = count + (repeat - 1) })
  })
  return count
}

function missingStickers (album: Album): number {
  let count: number = 0
  Object.keys(album).forEach((code) => {
    const missingStickers = album[code].figures
      .filter(({ repeat }) => repeat === 0)
    count = count + missingStickers.length
  })
  return count
}

export const useAlbumStore = create<AlbumState>()((set, get) => ({
  album: undefined,
  idAlbum: undefined,
  setIdAlbum: (id: string) => set(() => ({ id })),
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
    if (album != null) {
      return missingStickers(album)
    }
    return 0
  },
  totalRepeatedStickerCount: () => {
    const { album } = get()
    if (album != null) {
      return repeatedStickers(album)
    }
    return 0
  }

}))
