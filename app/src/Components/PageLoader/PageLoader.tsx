import { Block, Loader } from 'react-bulma-components'
import styled from 'styled-components'

const StyledLoader = styled(Loader)`
  width: 200px;
  height: 200px;
  border-width: 6px;
  margin: auto;
`
const ContainerStyled = styled(Block)`
  overflow-y:hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
  margin-bottom: 0px;
`

const PageLoader = (): JSX.Element => {
  return (
    <ContainerStyled>
      <StyledLoader />
    </ContainerStyled>
  )
}

export default PageLoader
