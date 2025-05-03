// pages/index.tsx
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

interface HomeContent {
  text: string;
  imageUrl: string;
  fileUrl: string | null;
  fileName: string | null;
}

const Home: React.FC = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState<HomeContent>({
    text: "",
    imageUrl: "",
    fileName: null,
    fileUrl: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newFile, setNewFile] = useState<File | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewFile(e.target.files[0]);
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
      if (newFile) {
        formData.append("file", newFile);
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
      <section className="mb-5">
        <div className="mb-8 flex items-center justify-between">
          <h1
            className={`font-editorial-old text-5xl`}
            style={{ WebkitTextStroke: "1px black" }}
          >
            Femmes en cévennes
          </h1>
        </div>
        {!isEditing ? (
          <div className="min-h-[50vh]">
            <div className="relative w-full">
              <Image
                src={
                  `https://femmes-en-cevennes.fr${content.imageUrl}` ||
                  "/placeholder.jpg"
                }
                alt="Image d'accueil"
                width={1080}
                height={1080}
                unoptimized
                sizes="100%"
                className="m-auto w-full max-w-screen-sm border border-solid border-black"
                style={{
                  objectFit: "contain",
                }}
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
            {content.fileUrl && (
              <div className="mt-8">
                <a
                  href={`https://femmes-en-cevennes.fr${content.fileUrl}`}
                  download={content.fileName}
                  className="inline-block rounded-full border border-solid border-black px-4 py-2 text-black transition-colors hover:bg-black hover:text-white"
                >
                  Télécharger {content.fileName}
                </a>
              </div>
            )}
            {session && (
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 inline-block rounded-full border border-solid border-black px-4 py-2 text-black transition-colors hover:bg-black hover:text-white"
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
              className="mb-4 min-h-[50vh] w-full border border-solid border-black bg-white p-2"
              rows={4}
            />
            <label className="mb-2 block">Image à télécharger :</label>
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="mb-4 inline-block w-full rounded-full border border-solid border-black px-6 py-2 text-black transition-colors hover:bg-black hover:text-white"
            />
            {error && (
              <div className="mb-4 rounded-md bg-red-100 p-4 text-red-700">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="mb-2 block">Fichier à télécharger :</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="inline-block w-full rounded-full border border-solid border-black px-6 py-2 text-black transition-colors hover:bg-black hover:text-white"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className={`border-2 border-solid border-black ${
                isLoading
                  ? "bg-gray-400"
                  : "bg-black text-white hover:bg-white hover:text-black"
              } inline-block rounded-full border border-solid border-black px-4 py-2 transition-colors`}
            >
              {isLoading ? "Sauvegarde en cours..." : "Sauvegarder"}
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewImage(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="ml-4 inline-block rounded-full border border-solid border-black px-4 py-2 text-black transition-colors hover:bg-black hover:text-white"
            >
              Annuler
            </button>
          </div>
        )}
      </section>
      <div className="h-[1px] w-full bg-black" />
      <footer className="mt-5 flex items-center justify-between">
        {session ? (
          <div className="flex w-full items-center justify-between">
            <span className="mr-4">
              Bonjour, {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="inline-block rounded-full border border-solid border-black px-4 py-2 text-black transition-colors hover:bg-black hover:text-white"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="inline-block rounded-full border border-solid border-black px-4 py-2 text-black transition-colors hover:bg-black hover:text-white"
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
