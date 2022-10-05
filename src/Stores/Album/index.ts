import create from "zustand";

export interface Figure {
  value: string;
  repeat: number;
}

export interface Section {
  figures: Figure[];
}

export type Album = { [key: string]: Section };

export interface AlbumState {
  album?: Album;
  id?: string;
  setIdAlbum: (id: string) => void;
  setAlbum: (album: Album) => void;
  increaseSticker: (code: string, number: string) => void;
}

export const useAlbumStore = create<AlbumState>()((set) => ({
  album: undefined,
  idAlbum: undefined,
  setIdAlbum: (id: string) => set(() => ({ id })),
  setAlbum: (album: Album) => set(() => ({ album })),
  increaseSticker: (code: string, number: string) => set((state) => {
    if( state.album ) {
      const codeFigures = state.album[code].figures;
      const newFiguresPerCode = codeFigures.map((sticker) => {
        if(sticker.value === number) {
          return { ...sticker, repeat: sticker.repeat + 1 };
        }
        return sticker;
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
  }, true)

}))
