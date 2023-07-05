import { IconStyled } from './StyledComponents'

interface ShowSelectedProps {
  selected: boolean
}

function ShowSelected ({ selected }: ShowSelectedProps) {
  if (selected) {
    return (
      <IconStyled>
        <i className='fa-regular fa-circle-check' />
      </IconStyled>
    )
  }

  return null
}

export default ShowSelected
