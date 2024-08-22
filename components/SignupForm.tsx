import React, { useState } from "react";
import { useRouter } from "next/router";

const SignupForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/auth/signin");
      } else {
        const data = await response.json();
        setError(
          data.message || "Une erreur est survenue lors de l'inscription",
        );
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      setError("Une erreur est survenue lors de l'inscription");
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
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-2 block text-sm font-bold text-white"
        >
          Confirmer le mot de passe
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="translate-x-boxShadowX translate-y-boxShadowY block w-full border-2 border-black bg-white p-2.5 text-sm text-black focus:border-black focus:ring-black"
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        className="shadow-dark hover:translate-x-boxShadowX hover:translate-y-boxShadowY mt-8 w-full border-2 border-solid border-black bg-yellow-400 px-4 py-2 font-bold text-black transition-all hover:bg-yellow-500 hover:shadow-none"
      >
        {"S'inscrire"}
      </button>
    </form>
  );
};

export default SignupForm;
