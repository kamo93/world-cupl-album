import { Outlet } from "react-router-dom";
import MenuBar from "../Components/MenuBar/MenuBar";

function MenuBarLayout(): JSX.Element {
  return (
    <>
      <Outlet />
      <MenuBar />
    </>
  );
}

export default MenuBarLayout;
