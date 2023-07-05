import { Block, Icon } from "react-bulma-components"
import styled from "styled-components"

export const ContainerStyled = styled(Block)`
padding-top: 50px;
`

export const AlbumsContainerStyled = styled.div`
margin: 12px;
`

export const EmailContainerStyled = styled.div`
border: 1px solid blue;
margin: 46px 10px 10px;
padding: 6px 8px;
border-radius: 8px;
`

export const AlbumItemStyled = styled.li`
padding: 12px 10px;
border: 1px solid #3e8ed0;
color: #3e8ed0;
margin: 8px 0px;
border-radius: 8px;
display: flex;
flex: row;
justify-content: space-between;
cursor: pointer;
&.selected {
  background-color: #3e8ed0;
  border-color: #dcdcdc;
  color: #dcdcdc;
}
`

export const IconStyled = styled(Icon)`
color: #dcdcdc;
`
