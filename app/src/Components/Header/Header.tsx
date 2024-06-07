import { Navbar } from "react-bulma-components";

const Header = () => {
  return (
    <header>
      <Navbar>
        <Navbar.Menu>
          <Navbar.Container align="right">
            <Navbar.Item href="#">Estadisticas</Navbar.Item>
            <Navbar.Item>Trade</Navbar.Item>
            <Navbar.Item>Settings</Navbar.Item>
          </Navbar.Container>
        </Navbar.Menu>
      </Navbar>
    </header>
  );
};

export default Header;
