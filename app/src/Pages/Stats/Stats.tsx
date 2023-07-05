import { Block } from 'react-bulma-components'
import styled from 'styled-components'
import { useAlbumStore } from '../../Stores/Album'
import Stat from './Stat'
import TotalPercentage from './TotalPercentage'

function missingPercentage (missingStickersCount: number, total: number): string {
  return `${(((total - missingStickersCount) * 100) / total).toFixed(0)}`
}

const ContainerStatsStyled = styled(Block)`
  min-height: 100vh;
  &.block:not(:last-child) {
    margin-bottom: 0px;
  }
`
// try animation why literally render everyupdate but react render show problem and its slow
// right best using styled components and keyframes
// didn't try using svg because info says that its the same perfomant and has more feature some will better
// for more complicated stuff
function Stats (): JSX.Element {
  const repeatedStickerCount = useAlbumStore((state) => state.totalRepeatedStickerCount)
  const missingStickerCount = useAlbumStore((state) => state.totalMissingStickerCount)
  const getTotalStickerCount = useAlbumStore((state) => state.totalStickers)

  return (
    <ContainerStatsStyled display='flex' flexDirection='column' justifyContent='center'>
      <TotalPercentage percentageCompleted={Number(missingPercentage(missingStickerCount(), getTotalStickerCount()))} />
      <Stat label='Total' value={`${getTotalStickerCount() - missingStickerCount()}`} />
      <Stat label='Faltantes' value={`${missingStickerCount()}`} />
      <Stat label='Repetidas' value={`${repeatedStickerCount()}`} />
    </ContainerStatsStyled>
  )
}

export default Stats
