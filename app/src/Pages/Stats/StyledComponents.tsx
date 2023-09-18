import { Block } from 'react-bulma-components'
import styled from 'styled-components'

export const ContainerStatsStyled = styled(Block)`
  overflow-y: hidden;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex: 1 0 auto;
  &.block:not(:last-child) {
    margin-bottom: 0px;
  }
`
