import { Block, Heading, Icon } from 'react-bulma-components'
import styled from 'styled-components'

export const AlbumNameStyled = styled(Heading)`
  &.title {
    margin-bottom: 1rem;
  }
`

export const SectionStyled = styled(Block)`
  display: grid;
  grid-template-columns: repeat(6, auto);
`

export const SubstractIcon = styled(Icon)<{ $isActive: boolean }>`
  border: 1px solid red;
  border-radius: 50%;
  border: ${({ $isActive }) => $isActive ? '1px solid white' : '1px solid red'};
  background-color: ${({ $isActive }) => $isActive ? 'red' : 'white'};
  color: ${({ $isActive }) => $isActive ? 'white !important' : ''}
`

export const RepeatIcon = styled(Icon)<{ $isActive: boolean }>`
  border: 1px solid #ffe08a;
  border-radius: 50%;
  border: ${({ $isActive }) => $isActive ? '1px solid white' : '1px solid #ffe08a'};
  background-color: ${({ $isActive }) => $isActive ? '#ffe08a' : 'white'};
  color: ${({ $isActive }) => $isActive ? 'white !important' : ''}
`

export const FiltersContainerStyled = styled(Block)`
  width: 100%;
  z-index: 10;
  padding: 1rem;
  -webkit-box-shadow: -1px 13px 11px -7px rgba(153,137,153,1);
  -moz-box-shadow: -1px 13px 11px -7px rgba(153,137,153,1);
  box-shadow: -1px 13px 11px -7px rgba(153,137,153,1);
  &.block:not(:last-child) {
    margin-bottom: 0;
  }
`

export const AlbumContatinerStyled = styled(Block)`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: scroll;
  padding-top: 1rem;
  >div:last-child {
    margin-bottom: 3.8rem;
  }
`

export const ContainerStyled = styled(Block)`
  overflow-y: hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
  &.block:not(:last-child) {
    margin-bottom: 0px;
  }
`
