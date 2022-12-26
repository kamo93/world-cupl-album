import MenuBar from '../Components/MenuBar/MenuBar'

interface WithMenuBarProps {
  children: JSX.Element
}

function WithMenuBar ({ children }: WithMenuBarProps): JSX.Element {
  return (
    <div>
      {children}
      <MenuBar />
    </div>
  )
}

export default WithMenuBar
