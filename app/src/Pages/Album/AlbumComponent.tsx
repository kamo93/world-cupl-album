import { Heading, Level } from 'react-bulma-components'
import Figure from '../../Figure'
import { Album } from '../../Stores/Album'
import { AlbumContatinerStyled, SectionStyled } from './StyledComponents'

interface AlbumComponentProps {
  albumList: Album
  increaseOneOnRepeatSticker: (code: string, value: string, isSubtractMode: boolean) => void
  isSubtractMode: boolean
}

function AlbumComponent ({ albumList, increaseOneOnRepeatSticker, isSubtractMode }: AlbumComponentProps) {
  return (
    <AlbumContatinerStyled>
      {(albumList !== null)
        ? Object.keys(albumList).map((code) => {
          if (albumList[code].figures.length === 0) return null
          return (
            <Level.Side key={code}>
              <Level.Item mt={1}>
                <Heading>
                  {code}
                </Heading>
              </Level.Item>
              <SectionStyled justifyContent='center'>
                {albumList[code].figures.map(({ value, repeat, isImportant }) => {
                  return (
                    <Figure
                      key={`${code}-${value}`}
                      albumNumber={value}
                      timesRepeat={repeat}
                      isImportant={isImportant}
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

  )
}

export default AlbumComponent
