import { Block, Button } from 'react-bulma-components'
import styled from 'styled-components'
const REPEATXCOLOR = {
  0: { color: 'info', outlined: true },
  1: { color: 'info', outlined: false }
}

const REPEATXCOLORIMPORTANT = {
  0: { color: 'warning', outlined: true },
  1: { color: 'warning', outlined: false }
}

const FigureContainerStyled = styled(Block)`
  position: relative;
  display: inline-flex;
`

const RepetedStyled = styled(Block)`
  position: absolute;
  top: 1px;
  right: 3px;
  background-color: rgba(255, 90, 90, 0.83);
  border-radius: 100%;
  z-index: 10;
  text-align: center;
  height: 22px;
  width: 22px;
`

const RepeatedTextStyled = styled.p`
  font-size: 0.6rem;
  text-align: center;
  font-weight: bold;
  color: white;
  line-height: 22px;
`

const ButtonStyled = styled(Button)`
  &:focus {
    background-color: transparent;
  }
`

interface FigureProps {
  albumNumber: string
  timesRepeat: number
  isImportant: boolean
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

function colorByTimesRepeated (timesRepeat: number, colorDictionary: typeof REPEATXCOLOR) {
  const controlTimesRepeated = timesRepeat >= 1 ? 1 : 0
  return colorDictionary[controlTimesRepeated]
}

export default function Figure ({ albumNumber, timesRepeat, isImportant, onClick }: FigureProps) {
  let colors = {}

  if (isImportant) {
    colors = colorByTimesRepeated(timesRepeat, REPEATXCOLORIMPORTANT)
  } else {
    colors = colorByTimesRepeated(timesRepeat, REPEATXCOLOR)
  }

  return (
    <FigureContainerStyled m='0' p='1'>
      {timesRepeat >= 2 ? <RepetedStyled marginless>
        <RepeatedTextStyled>+ {timesRepeat}</RepeatedTextStyled>
      </RepetedStyled> : null}
      <ButtonStyled textSize='6' textWeight='light' p='3' m='1' rounded {...colors} onClick={onClick}>
        {albumNumber}
      </ButtonStyled>
    </FigureContainerStyled>
  )
}
