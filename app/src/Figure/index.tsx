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
  border: 2px solid black;
  color: black;
  border-radius: 100%;
  z-index: 10;
  text-align: center;
  height: 24px;
  width: 24px;
  padding: 4px 0px;
`

const RepeatedTextStyled = styled.p`
  font-size: 0.5rem;
  text-align: center;
  font-weight: bold;
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
