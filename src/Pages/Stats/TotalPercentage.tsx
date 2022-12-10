import styled, { css, keyframes } from "styled-components"

const TOTAL_DEGREES = 270
const ANIMATED_STEPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]

const animateStat = (totalDegress: number): Keyframes => {
  let keyframesString = ''
  ANIMATED_STEPS.forEach((percentageStep) => {
    const calculatedDegree = (percentageStep * totalDegress) / 100
    const step = `${percentageStep}% {
      background: conic-gradient(#485fc7 ${calculatedDegree}deg, gray 0deg)
    }`
    keyframesString = keyframesString + step
  })
  return keyframes`${css`${keyframesString}`}`
}
const TotalStickerStyled = styled.div<{ degrees: number }>`
  align-self: center;
  width: 200px;
  height: 200px;
  position: relative;
  border-radius: 50%;
  background: ${({ degrees }) => `conic-gradient(#485fc7 ${degrees}deg, gray 0deg);`}
  animation: ${(props) => animateStat(props.degrees)} 0.5s ease-out 1;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid white;
  transform: rotate(225deg);
  &::before {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: none;
    transform: rotate(${TOTAL_DEGREES}deg);
    background: conic-gradient(white 90deg, transparent 0deg); 
  }
  &::after {
    content: '';
    width: 160px;
    height: 160px;
    position: absolute;
    background-color: white;
    border-radius: 50%;
  }
  .value{
    z-index: 10;
    rotate: 135deg;
    font-size: 1.75rem;
  }
`
function TotalPercentage ({ percentageCompleted }: { percentageCompleted: number }): JSX.Element {
  const totalInDegrees = ((percentageCompleted * TOTAL_DEGREES) / 100).toFixed(0)

  return (
    <TotalStickerStyled degrees={Number(totalInDegrees)}>
      <div className='value'>{percentageCompleted}%</div>
    </TotalStickerStyled>
  )
}

export default TotalPercentage
