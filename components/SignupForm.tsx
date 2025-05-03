import { useRouter } from "next/router";
import React, { useState } from "react";

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
          className="ml-5 block text-xs font-bold text-black"
        >
          Email
        </label>
        <input
          placeholder="E-mail"
          type="email"
          id="email"
          value={email}
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
          placeholder="Mot de passe"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full rounded-full border border-black bg-white px-4 py-2.5 text-sm text-black focus:border-black focus:ring-black"
          required
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="ml-5 block text-xs font-bold text-black"
        >
          Confirmer le mot de passe
        </label>
        <input
          placeholder="Mot de passe"
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="block w-full rounded-full border border-black bg-white px-4 py-2.5 text-sm text-black focus:border-black focus:ring-black"
          required
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        className="mt-8 inline-block w-full rounded-full border border-solid border-black bg-black px-4 py-2 text-white transition-colors hover:bg-white hover:text-black"
      >
        {"S'inscrire"}
      </button>
    </form>
  );
};

export default SignupForm;
