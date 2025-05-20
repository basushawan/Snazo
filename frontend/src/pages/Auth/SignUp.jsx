import React from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import Input from "../../components/inputs/Input";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [profilePic, setProfilePic] = React.useState(null);
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [adminInviteToken, setAdminInviteToken] = React.useState("");
  const [error, setError] = React.useState(null);

  //Handle singup form submit
  const handleSingUp = async (e) => {
    e.preventDefault();
    if (!fullName) {
      setError("Please enter fullname");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email");
      return;
    }
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setError("");
  };
  return (
    <AuthLayout>
      <div className="lg:w-[100%]  h-auto  md:h-full mt-10 md:mt-0  flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an account</h3>
        <p className="text-xs text-slate-700 mb-6 mt-[5px]">
          Join us today by entering your details below
        </p>

        <form onSubmit={handleSingUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={fullName}
              label="Full Name"
              placeholder="John"
              type="text"
              required
              onChange={({ target }) => setFullName(target.value)}
            />
            <Input
              value={email}
              onChange={({ target }) => setEmail(target.value)}
              label="Email Address"
              placeholder="john@exmaple.com"
              type="text"
              required
            />
            <Input
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              label="Password"
              placeholder="Minimum 8 Characters"
              type="password"
              required
            />
            <Input
              value={adminInviteToken}
              onChange={({ target }) => setAdminInviteToken(target.value)}
              label="Admin Invite Token"
              placeholder="6 Characters"
              type="password"
            />
          </div>
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary uppercase">
            Sign Up
          </button>
          <p className="mt-3 text-slate-800 text-[13px] text-center">
            Already have an account?
            <Link
              to="/login"
              className="font-medium text-primary cursor-pointer ml-1"
            >
              Login to your account
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
