import { Block } from 'react-bulma-components'
import styled from 'styled-components'
import Item, { ItemProps } from './Item'

const MenuBarContainerStyled = styled(Block)`
  position: fixed;
  bottom: 0;
  height: 3.5rem;
  width: 100%;
  background-color: #f4f4f4;
  border-top: solid 1px #ececec;
  display: flex;
  flex-wrap: wrap;
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
