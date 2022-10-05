import { useState, useMemo } from 'react'
import { Block, Heading, Level, Box, Icon, Button } from "react-bulma-components";
import styled from 'styled-components';
import AutoCompleteCodes from '../../Components/AutoCompleteCodes/AutoCompleteCodes';
import { useSupabaseContext } from '../../Contexts/SupabaseContext';
import Figure from '../../Figure';
import { Album, useAlbumStore } from '../../Stores/Album';

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
`

const ContainerStyled = styled(Block)`
  overflow-y:hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
`

const AlbumPage = () => {
  const [isSubtractMode, setIsSubtractMode] = useState(false)
  const [isRepeatedMode, setIsRepeatedMode] = useState(false)
  const [filterStickers, setFilterStickers] = useState<Album | null>()
  const { album, id: idAlbum, setAlbum } = useAlbumStore((state) => state)
  const { supabase } = useSupabaseContext();

  async function increaseOneOnRepeatSticker(code: string, number: string, isSubtractMode: boolean) {
    if( album ) {
      const codeFigures = album[code].figures;
      const newFiguresPerCode = codeFigures.map((sticker) => {
        if(sticker.value === number) {
          let newValue = 0;
          if (isSubtractMode && sticker.repeat > 0) {
            newValue = sticker.repeat - 1;
          }
          if(!isSubtractMode) {
            newValue = sticker.repeat + 1;

          }
          return { ...sticker, repeat: newValue };
        }
        return sticker;
      })
      try {
        const { data, error } = await supabase
          .from('albums')
          .update(
            { stickers: 
              { 
                ...album, 
                [code]: { 
                  figures: [...newFiguresPerCode] 
                } 
              } 
            }
          ).match({ id: idAlbum }).select()
        if (!error) {
          console.log(data)
          setAlbum(data[0].stickers)
        }
      } catch(e) {
        console.warn(e)
      }
    }
  }

  function filterAlbum(codeFilter: string) {
    if(codeFilter && album) {
      setFilterStickers({ [codeFilter]: album[codeFilter] })
    } else {
      setFilterStickers(null)
    }
  }

  const list = useMemo(() => {
    return filterStickers ? filterStickers : album;
  }, [album, filterStickers])

  return (
    <ContainerStyled>
      <FiltersContainerStyled mb={0}>
        <AutoCompleteCodes 
          onItemSelected={filterAlbum}
        />
        <Button 
          color={isSubtractMode ? "danger" : ""} 
          size="small" 
          mr={2}
          onClick={() => { setIsSubtractMode(prevValue => !prevValue) }}
          >
          <SubstractIcon
            color="danger"
            size="small"
            mr={2}
            active={isSubtractMode}
          >
            <i className="fa-solid fa-minus"></i>
          </SubstractIcon>
          <span>Restar</span>
        </Button>
        <Button 
          color={isRepeatedMode ? "warning": ""}
          size="small" 
          mr={2}
          onClick={() => { setIsRepeatedMode(prevValue => !prevValue) }}
        >
          <RepeatIcon
            color="warning"
            size="large"
            mr={2}
            active={isRepeatedMode}
          >
            <i className="fa-solid fa-repeat"></i>
          </RepeatIcon>
          <span>Repetidas</span>
        </Button>
        <Button color="" size="small">
          <Icon
            color="link"
            size="small"
            mr={2}
            onClick={() => { setIsSubtractMode(prevValue => !prevValue) }}
          >
            <i className="fa-solid fa-ghost"></i>
          </Icon>
          <span>Faltantes</span>
        </Button>
      </FiltersContainerStyled>
      <AlbumContatinerStyled>
        {list ? Object.keys(list).map((code) => {
          return (
            <Level.Side key={code}>
              <Level.Item>
                <Heading >
                  {code}
                </Heading>
              </Level.Item>
              <Block justifyContent="center" display="flex" flexWrap="wrap">
                {list[code].figures.map(({ value, repeat }) => {
                  return (
                    <Figure 
                      key={`${code}-${value}`} 
                      albumNumber={value} 
                      timesRepeat={repeat} 
                      onClick={() => {increaseOneOnRepeatSticker(code, value, isSubtractMode)}}
                      />
                  )
                })}
              </Block>
            </Level.Side>
          )
        }): null}
      </AlbumContatinerStyled>
    </ContainerStyled>
    
  )

}

export default AlbumPage;
