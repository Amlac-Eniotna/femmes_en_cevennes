// pages/auth/signup.tsx
import React from "react";
import SignupForm from "../../components/SignupForm";

const SignUpPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cyan-700 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2
            className="mt-6 text-center text-4xl font-extrabold text-amber-400"
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
