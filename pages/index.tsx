// pages/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Notable } from "next/font/google";

const notable = Notable({ weight: ["400"], subsets: ["latin"] });

interface HomeContent {
  text: string;
  imageUrl: string;
}

const Home: React.FC = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState<HomeContent>({
    text: "",
    imageUrl: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const response = await fetch("/api/home-content", { cache: "no-store" });
    if (response.ok) {
      const data = await response.json();
      setContent(data);
      setNewText(data.text);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("text", newText);
      if (newImage) {
        formData.append("image", newImage);
      }

      const response = await fetch("/api/home-content", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de la sauvegarde");
      }

      const updatedContent = await response.json();
      setContent(updatedContent);
      setIsEditing(false);
      setNewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      setError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto flex min-h-dvh max-w-screen-lg flex-col justify-between px-4 py-8">
      <section>
        <div className="mb-8 flex items-center justify-between">
          <h1
            className={`${notable.className} translate-x-boxShadowX translate-y-boxShadowY stroke-black text-5xl font-extrabold text-amber-400`}
            style={{ WebkitTextStroke: "1px black" }}
          >
            Femmes en cévennes
          </h1>
        </div>
        {!isEditing ? (
          <div className="min-h-[50vh] translate-x-boxShadowX translate-y-boxShadowY border-2 border-solid border-black bg-white p-8">
            <div className="relative min-h-48 w-full">
              <Image
                src={
                  `https://femmes-en-cevennes.fr${content.imageUrl}` ||
                  "/placeholder.jpg"
                }
                alt="Image d'accueil"
                fill
                unoptimized
                style={{ objectFit: "contain" }}
                onError={(e) => {
                  console.error(
                    "Erreur de chargement de l'image:",
                    content.imageUrl,
                  );
                  e.currentTarget.src = "/placeholder.jpg";
                }}
              />
            </div>
            <p className="mt-8 text-xl">{content.text}</p>
            {session && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 border-2 border-solid border-black bg-yellow-400 px-4 py-2 font-bold text-black shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:bg-yellow-500 hover:shadow-none"
              >
                Modifier
              </button>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className="mb-4 min-h-[50vh] w-full translate-x-boxShadowX translate-y-boxShadowY border-2 border-solid border-black bg-white p-2"
              rows={4}
            />
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="mb-4 block w-full border-2 border-solid border-black bg-yellow-400 px-4 py-2 font-bold text-black shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:bg-yellow-500 hover:shadow-none"
            />
            {error && (
              <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
                {error}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`border-2 border-solid border-black ${
                isLoading ? "bg-gray-400" : "bg-green-400 hover:bg-green-500"
              } px-4 py-2 font-bold text-black shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:shadow-none`}
            >
              {isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewImage(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="ml-4 border-2 border-solid border-black bg-red-400 px-4 py-2 font-bold text-black shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:bg-red-500 hover:shadow-none"
            >
              Annuler
            </button>
          </div>
        )}
      </section>
      <footer className="mt-4 flex items-center justify-between">
        {session ? (
          <div>
            <span className="mr-4 text-white">
              Bonjour, {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="border-2 border-solid border-black bg-red-400 px-4 py-2 font-bold text-black shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:bg-red-500 hover:shadow-none"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="border-2 border-solid border-black bg-yellow-400 px-4 py-2 font-bold text-black shadow-dark transition-all hover:translate-x-boxShadowX hover:translate-y-boxShadowY hover:bg-yellow-500 hover:shadow-none"
            style={{}}
          >
            Se connecter
          </button>
        )}
      </footer>
    </main>
  );
};

export default Home;
