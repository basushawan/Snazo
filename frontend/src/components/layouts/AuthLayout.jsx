import React from "react";
import img from "../../assets/images/image.png";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen px-12 pt-8 pb-12 md:w-[60vw]">
        <h2 className="text-xl font-bold text-amber-600 text-center">
          𝕾𝖓𝖆𝖟𝖔✍
        </h2>
        <p className="text-sm font-medium text-cyan-950 text-center">
          A Workflow Managament System
        </p>
        {children}
      </div>

      <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url('bg-img.jpg')] bg-cover bg-no-repeat bg-center overflow-hidden p-8">
        <img src={img} alt="image" className="w-64 lg:w-[90%]" />
      </div>
    </div>
  );
};

export default AuthLayout;
