import { Block } from 'react-bulma-components'
import { useAlbumStore } from '../../Stores/Album'

function missingPercentage (missingStickersCount: number, total: number): string {
  return `${(((total - missingStickersCount) * 100) / total).toFixed(0)}%`
}

function Stats (): JSX.Element {
  const repeatedStickerCount = useAlbumStore((state) => state.totalRepeatedStickerCount)
  const missingStickerCount = useAlbumStore((state) => state.totalMissingStickerCount)
  console.log('render stats')
  return (
    <Block>
      <Block>
        <span>Total:</span>
        <span> {639 - missingStickerCount()}/ 639</span>
        <span> {missingPercentage(missingStickerCount(), 639)}</span>
      </Block>
      <Block>
        <span>Repetidas</span>
        <span>{repeatedStickerCount()}</span>
      </Block>
      <Block>
        <span>Faltantes</span>
        <span>{missingStickerCount()}</span>
      </Block>
    </Block>
  )
}

export default Stats
