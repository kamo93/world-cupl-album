import { Block, Heading, Icon, Level } from 'react-bulma-components'
import styled from 'styled-components'

export const AlbumNameStyled = styled(Heading)`
  &.title {
    margin-bottom: 1rem;
  }
`

export const InnerSectionStyled = styled(Block)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
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
  background-color: white;
  margin: 0 0.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow-y: scroll;
  margin-top: 0.50rem;
  margin-bottom: 13.50rem;
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

export const ScrollAlbumStyled = styled.div`
  background-color: #d9d8d8;
  overflow-y: scroll;
  min-height: 100%;
`

export const SectionStyled = styled(Level.Side)`
  border-top: 4px solid rgba(162,171,206, 0.4);
  padding-bottom: 0.50rem;
  &:last-child {
    border-bottom: 4px solid rgba(162,171,206, 0.4);
  }
`
