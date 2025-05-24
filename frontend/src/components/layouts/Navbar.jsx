import React from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activeMenu }) => {
  const [openSideMenu, setOpenSideMenu] = React.useState(false);
  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black"
        onClick={() => {
          setOpenSideMenu(!openSideMenu);
        }}
      >
        {openSideMenu ? (
          <HiOutlineX className="text-xl" />
        ) : (
          <HiOutlineMenu className="text-xl" />
        )}
      </button>
      <h2 className="text-xl font-bold text-amber-600 text-center"> 𝕾𝖓𝖆𝖟𝖔✍</h2>
      {openSideMenu && (
        <div className="fixed -ml-4 bg-white top-[61px]">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
