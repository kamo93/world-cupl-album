import { Button, Icon } from 'react-bulma-components'
import AutoCompleteCodes from '../../Components/AutoCompleteCodes/AutoCompleteCodes'
import { RepeatIcon, SubstractIcon } from './StyledComponents'

interface ControlsProps {
  isSubtractMode: boolean
  filterAlbum: (codeFilter: string) => void
  isRepeatedMode: boolean
  repeatedStickers: () => void
  erraseStickers: () => void
}

function Controls ({ isSubtractMode, filterAlbum, erraseStickers, isRepeatedMode, repeatedStickers }: ControlsProps) {
  return (
    <>
      <AutoCompleteCodes
        onItemSelected={filterAlbum}
      />
      <Button
        color={isSubtractMode ? 'danger' : ''}
        size='small'
        mr={2}
        onClick={erraseStickers}
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
        onClick={repeatedStickers}
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
          onClick={erraseStickers}
        >
          <i className='fa-solid fa-ghost' />
        </Icon>
        <span>Faltantes</span>
      </Button>
    </>
  )
}

export default Controls
