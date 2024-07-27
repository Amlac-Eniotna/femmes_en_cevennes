// pages/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

interface HomeContent {
  text: string;
  imageUrl: string;
}

const Home: React.FC = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState<HomeContent>({ text: '', imageUrl: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const response = await fetch('/api/home-content');
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
    formData.append('text', newText);
    if (newImage) {
      formData.append('image', newImage);
    }

    const response = await fetch('/api/home-content', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const updatedContent = await response.json();
      setContent(updatedContent);
      setIsEditing(false);
      setNewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Bienvenue sur notre site</h1>
        {session ? (
          <div>
            <span className="mr-4">Bonjour, {session.user?.name || session.user?.email}</span>
            <button
              onClick={() => signOut()}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Se connecter
          </button>
        )}
      </div>
      
      {!isEditing ? (
        <div>
          <p className="mb-4">{content.text}</p>
          <Image src={content.imageUrl} alt="Image d'accueil" width={500} height={300} />
          {session && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
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
            className="w-full p-2 mb-4 border rounded"
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
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
          >
            Sauvegarder
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setNewImage(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;