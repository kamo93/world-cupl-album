import { Icon, Block } from 'react-bulma-components'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

const MenuItemContainerStyled = styled(NavLink)`
  display: flex;
  flex: 1;
  justify-content: center;
`

const MenuIconStyled = styled(Icon)`
  display: flex;
`

interface ButtonStyledProps {
  readonly $isActive: boolean
}

const ButtonStyled = styled(Block)<ButtonStyledProps>`
  display: flex;
  flex-direction: column;
  color: #807f7f;
  align-items: center;
  border: none;
  background-color: transparent;
  height: 100%;
  span.has-text-dark {
    color: #807f7f !important;
  }
  ${(props) => {
    if (props.$isActive) {
      return `
        color: #3e8ed0 !important;
        span.has-text-dark {
          color: #3e8ed0 !important;
        }
      `
    }
    return ''
  }}
  &:focus, &:active {
    outline: none !important;
    box-shadow: none !important;
  }
  .icon:first-child:not(:last-child) {
    margin: 0;
  }
`

export interface ItemProps {
  label: string
  icon: 'book-open' | 'chart-line' | 'gears'
  routePath: 'album' | 'stats' | 'settings'
}

function Item ({ label, icon, routePath }: ItemProps): JSX.Element {
  return (
    <MenuItemContainerStyled to={`/protected/user/${routePath}`}>
      {({ isActive }) => {
        console.log('hi', typeof isActive)
        return (
          <ButtonStyled $isActive={isActive}>
            <MenuIconStyled
              color='dark'
              size='medium'
            >
              <i className={`fa-solid fa-${icon} fa-lg`} />
            </MenuIconStyled>
            <span>{label}</span>
          </ButtonStyled>
        )
      }}
    </MenuItemContainerStyled>
  )
}

export default Item
