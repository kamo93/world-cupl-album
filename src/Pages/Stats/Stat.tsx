import { Block } from 'react-bulma-components'
import styled from 'styled-components'

interface StatProps {
  label: string
  value: string
}

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

function Stat ({ label, value }: StatProps): JSX.Element {
  return (
    <ContainerStatStyled>
      <span>{label}</span>
      <span>{value}</span>
    </ContainerStatStyled>
  )
}

export default Stat
