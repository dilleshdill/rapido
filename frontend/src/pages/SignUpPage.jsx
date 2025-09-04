import React from "react";
import { SignUp} from "@clerk/clerk-react";


const SignUpPage = () => {
  
  return (
    <div className="flex justify-center items-center min-h-screen min-w-screen">
      <SignUp />
    </div>
  );
};

export default SignUpPage;
