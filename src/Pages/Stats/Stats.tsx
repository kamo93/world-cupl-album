import { Block } from 'react-bulma-components'

function Stats (): JSX.Element {
  return (
    <Block>
      <Block>
        <span>Total</span>
        <span> / Total number</span>
        <span> %result</span>
      </Block>
      <Block>
        <span>Repetidas</span>
        <span> / Total number</span>
      </Block>
      <Block>
        <span>Faltantes</span>
        <span> / Total number</span>
      </Block>
    </Block>
  )
}

export default Stats
