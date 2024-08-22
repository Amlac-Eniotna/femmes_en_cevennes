import React from "react";
import LoginForm from "../../components/LoginForm";

const SignInPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cyan-700 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2
            className="mt-6 text-center text-4xl font-extrabold text-amber-400"
            style={{ WebkitTextStroke: "1px black" }}
          >
            Connexion à votre compte
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
};

export default SignInPage;
