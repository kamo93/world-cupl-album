import { Block } from 'react-bulma-components'
import styled, { css, Keyframes, keyframes } from 'styled-components'
import { useAlbumStore } from '../../Stores/Album'

function missingPercentage (missingStickersCount: number, total: number): string {
  return `${(((total - missingStickersCount) * 100) / total).toFixed(0)}`
}

const ContainerStatsStyled = styled(Block)`
  min-height: 100vh;

`

const ContainerStatStyled = styled(Block)`
  margin: 1rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.75rem;
  backgroud-color: white;
  box-shadow: 0 .5em 1em -0.125em rgba(10,10,10,.1),0 0px 0 1px rgba(10,10,10,.02);
  color: #4a4a4a;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
`

const animateSteps = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
const animateStat = (totalDegress: number): Keyframes => {
  let keyframesString = ''
  animateSteps.forEach((percentageStep) => {
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
    transform: rotate(270deg);
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

interface StatProps {
  label: string
  value: string
}

function Stat ({ label, value }: StatProps): JSX.Element {
  return (
    <ContainerStatStyled>
      <span>{label}</span>
      <span>{value}</span>
    </ContainerStatStyled>
  )
}

function TotalStatAnimated ({ percentageCompleted }: { percentageCompleted: number }): JSX.Element {
  const totalInDegrees = ((percentageCompleted * 270) / 100).toFixed(0)
  console.log('totalInDegrees', totalInDegrees)
  return (
    <TotalStickerStyled degrees={Number(totalInDegrees)}>
      <div className='value'>{percentageCompleted}%</div>
    </TotalStickerStyled>
  )
}
// try animation why literally render everyupdate but react render show problem and its slow
// right best using styled components and keyframes
// didn't try using svg because info says that its the same perfomant and has more feature some will better
// for more complicated stuff
function Stats (): JSX.Element {
  const repeatedStickerCount = useAlbumStore((state) => state.totalRepeatedStickerCount)
  const missingStickerCount = useAlbumStore((state) => state.totalMissingStickerCount)
  console.log('render stats', missingPercentage(missingStickerCount(), 639))
  return (
    <ContainerStatsStyled display='flex' flexDirection='column' justifyContent='center'>
      <TotalStatAnimated percentageCompleted={Number(missingPercentage(missingStickerCount(), 639))} />
      <Stat label='Total' value={`${639 - missingStickerCount()}`} />
      <Stat label='Porcentaje completado' value={`${missingPercentage(missingStickerCount(), 639)}%`} />
      <Stat label='Repetidas' value={`${repeatedStickerCount()}`} />
      <Stat label='Faltantes' value={`${missingStickerCount()}`} />
    </ContainerStatsStyled>
  )
}

export default Stats
