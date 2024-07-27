// pages/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";

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

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const response = await fetch("/api/home-content");
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
    const formData = new FormData();
    formData.append("text", newText);
    if (newImage) {
      formData.append("image", newImage);
    }

    const response = await fetch("/api/home-content", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const updatedContent = await response.json();
      setContent(updatedContent);
      setIsEditing(false);
      setNewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-4xl font-bold">Femmes en cévennes</h1>
        {session ? (
          <div>
            <span className="mr-4">
              Bonjour, {session.user?.name || session.user?.email}
            </span>
            <button
              onClick={() => signOut()}
              className="rounded bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Se connecter
          </button>
        )}
      </div>

      {!isEditing ? (
        <div>
          <p className="mb-4">{content.text}</p>
          <Image
            src={content.imageUrl}
            alt="Image d'accueil"
            width={500}
            height={300}
          />
          {session && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
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
            className="mb-4 w-full rounded border p-2"
            rows={4}
          />
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            ref={fileInputRef}
            className="mb-4"
          />
          <button
            onClick={handleSave}
            className="mr-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
          >
            Sauvegarder
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setNewImage(null);
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
