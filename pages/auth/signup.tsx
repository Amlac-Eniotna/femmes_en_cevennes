// pages/auth/signup.tsx
import React from "react";
import SignupForm from "../../components/SignupForm";

const SignUpPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        <div>
          <h2
            className="text-center text-4xl"
            style={{ WebkitTextStroke: "1px black" }}
          >
            Créer un compte
          </h2>
        </div>
        <SignupForm />
      </div>
    </div>
  );
};

export default SignUpPage;
