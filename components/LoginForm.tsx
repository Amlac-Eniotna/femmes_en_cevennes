import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";

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
          className="ml-5 block text-xs font-bold text-black"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          className="block w-full rounded-full border border-black bg-white px-4 py-2.5 text-sm text-black focus:border-black focus:ring-black"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="ml-5 block text-xs font-bold text-black"
        >
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded-full border border-black bg-white px-4 py-2.5 text-sm text-black focus:border-black focus:ring-black"
          required
        />
      </div>
      {error && (
        <p className="w-full text-center text-sm text-red-500">{error}</p>
      )}
      <button
        type="submit"
        className="mt-8 inline-block w-full rounded-full border border-solid border-black bg-black px-4 py-2 text-white transition-colors hover:bg-white hover:text-black"
      >
        Se connecter
      </button>
    </form>
  );
};

export default LoginForm;
