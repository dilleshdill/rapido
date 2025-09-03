import React from "react";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="flex justify-center items-center h-screen !bg-red-600">
      <SignIn />
    </div>
  );
};

export default Login;
