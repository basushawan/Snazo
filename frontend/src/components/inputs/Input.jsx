import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({
  value,
  onChange,
  label,
  placeholder,
  type,
  required = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <label className="text-[13px] text-slate-800">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <div className="input-box">
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
          value={value}
          onChange={onChange}
          required={required}
          {...rest}
        />

        {type === "password" &&
          (showPassword ? (
            <FaRegEye
              size={22}
              className="cursor-pointer text-primary"
              onClick={toggleShowPassword}
            />
          ) : (
            <FaRegEyeSlash
              size={22}
              className="cursor-pointer text-slate-400"
              onClick={toggleShowPassword}
            />
          ))}
      </div>
    </div>
  );
};

export default Input;
