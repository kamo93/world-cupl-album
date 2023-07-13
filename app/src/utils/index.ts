import { Album } from '../Stores/Album'

export function numberRepeatedStickers (album: Album): number {
  let count: number = 0
  Object.keys(album).forEach((code) => {
    album[code].figures
      .filter(({ repeat }) => repeat > 1)
      .forEach(({ repeat }) => { count = count + (repeat - 1) })
  })
  return count
}

export function repeatedStickers (album: Album): Album {
  let repeatedAlbum: Album = {}
  Object.keys(album).forEach((code) => {
    const repeatedFigures = album[code].figures
      .filter(({ repeat }) => repeat > 1)
    repeatedAlbum = {
      ...repeatedAlbum,
      [code]: {
        figures: repeatedFigures
      }
    }
  })
  return repeatedAlbum
}

export function missingStickers (album: Album): number {
  let count: number = 0
  Object.keys(album).forEach((code) => {
    const missingStickers = album[code].figures
      .filter(({ repeat }) => repeat === 0)
    count = count + missingStickers.length
  })
  return count
}

export function getTotalStickers (album: Album): number {
  let count: number = 0
  Object.keys(album).forEach((code) => {
    count = count + album[code].figures.length
  })
  return count
}
