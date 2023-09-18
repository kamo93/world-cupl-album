import { Block } from 'react-bulma-components'
import styled from 'styled-components'
import Item, { ItemProps } from './Item'

const MenuBarContainerStyled = styled(Block)`
  height: 3.5rem;
  width: 100%;
  background-color: #f4f4f4;
  border-top: solid 1px #ececec;
  /* position: fixed; */
  /* bottom: 0; */
  display: flex;
  flex-wrap: wrap;
  flex: 0 0 auto;
  z-index: 100;
  -webkit-box-shadow: -1px -6px 15px -3px rgba(153,137,153,1);
  -moz-box-shadow: -1px -6px 15px -3px rgba(153,137,153,1);
  box-shadow: -1px -6px 15px -3px rgba(153,137,153,1);
`

const MENU_ITEMS: ItemProps[] = [
  {
    label: 'Album',
    icon: 'book-open',
    routePath: 'album'
  },
  {
    label: 'Stats',
    icon: 'chart-line',
    routePath: 'stats'
  },
  {
    label: 'Settings',
    icon: 'gears',
    routePath: 'settings'
  }
]

function MenuBar (): JSX.Element {
  return (
    <MenuBarContainerStyled>
      {MENU_ITEMS.map((props, index) => (
        // use index as key since the values will not change
        <Item key={index} {...props} />
      ))}
    </MenuBarContainerStyled>
  )
}

export default MenuBar
