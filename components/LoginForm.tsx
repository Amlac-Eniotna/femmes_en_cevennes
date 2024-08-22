import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError("Email ou mot de passe invalide");
      } else {
        router.push("/"); // Redirigez vers la page souhaitée après la connexion
      }
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
      setError("Une erreur est survenue lors de la connexion");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-bold text-white"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="translate-x-boxShadowX translate-y-boxShadowY block w-full border-2 border-black bg-white p-2.5 text-sm text-black focus:border-black focus:ring-black"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-bold text-white"
        >
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="translate-x-boxShadowX translate-y-boxShadowY block w-full border-2 border-black bg-white p-2.5 text-sm text-black focus:border-black focus:ring-black"
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        className="shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY mt-8 w-full border-2 border-solid border-black bg-yellow-400 px-4 py-2 font-bold text-black transition-all hover:bg-yellow-500 hover:shadow-none"
      >
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;
