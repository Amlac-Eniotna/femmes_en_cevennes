import React from "react";
import LoginForm from "../../components/LoginForm";

const SignInPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        <div>
          <h2
            className="text-center text-4xl"
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
