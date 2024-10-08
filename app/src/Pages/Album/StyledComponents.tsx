import { Block, Heading, Icon, Level } from "react-bulma-components";
import styled from "styled-components";

export const AlbumNameStyled = styled(Heading)`
  &.title {
    margin-bottom: 1rem;
  }
`;

export const InnerSectionStyled = styled(Block)`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(56px, 1fr));
`;

export const SubstractIcon = styled(Icon)<{ $isActive: boolean }>`
  border: 1px solid red;
  border-radius: 50%;
  border: ${({ $isActive }) =>
    $isActive ? "1px solid white" : "1px solid red"};
  background-color: ${({ $isActive }) => ($isActive ? "red" : "white")};
  color: ${({ $isActive }) => ($isActive ? "white !important" : "")};
`;

export const RepeatIcon = styled(Icon)<{ $isActive: boolean }>`
  border: 1px solid #ffe08a;
  border-radius: 50%;
  border: ${({ $isActive }) =>
    $isActive ? "1px solid white" : "1px solid #ffe08a"};
  background-color: ${({ $isActive }) => ($isActive ? "#ffe08a" : "white")};
  color: ${({ $isActive }) => ($isActive ? "white !important" : "")};
`;

export const ContainerStyled = styled(Block)`
  min-height: calc(100% - 3.5rem);
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  &.block:not(:last-child) {
    margin-bottom: 0px;
  }
`;

export const FiltersContainerStyled = styled(Block)`
  width: 100%;
  z-index: 10;
  padding: 1rem;
  -webkit-box-shadow: -1px 13px 11px -7px rgba(153, 137, 153, 1);
  -moz-box-shadow: -1px 13px 11px -7px rgba(153, 137, 153, 1);
  box-shadow: -1px 13px 11px -7px rgba(153, 137, 153, 1);
  &.block:not(:last-child) {
    margin-bottom: 0;
  }
`;

export const AlbumContatinerStyled = styled(Block)`
  background-color: transparent;
  margin: 0 0.75rem;
  display: flex;
  flex-direction: column;
  margin-top: 0.5rem;
`;

export const ScrollAlbumStyled = styled.div`
  background-color: #d9d8d8;
  overflow-y: scroll;
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
`;

export const SectionStyled = styled(Level.Side)`
  background-color: white;
  border-top: 4px solid rgba(162, 171, 206, 0.4);
  padding-bottom: 0.5rem;
  &:last-child {
    border-bottom: 4px solid rgba(162, 171, 206, 0.4);
    margin-bottom: 2rem;
  }
`;
