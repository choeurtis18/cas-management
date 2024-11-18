'use client'

import { useState } from 'react'

import { useAddCategory } from "@/hooks/category";

export default function AddCategory(){
    const { addCategory } = useAddCategory();
    const [category, setCategory] = useState<{ name: string; description: string }>({
        name: "",
        description: ""
    }); // Les informations de la catégorie
    const [error, setError] = useState<string | null>(null); // Message d'erreur

    {/* Gère les changements dans les champs de saisie */}
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCategory({ ...category, [name]: value });
    };
    
    {/* Envoie les informations de la catégorie au serveur */}
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addCategory(category);
            window.location.href = "/category";
        }
        catch (error) {
            console.error("Error adding category:", error);
            setError("Erreut pendant l(ajout de tontine");
        }
    }

    return ( 
        <div className="pt-8 pb-16 bg-white antialiased px-4">
            <h1 className="text-base font-semibold text-gray-900">Ajouter une tontine</h1>

            {/* Affiche les erreurs */}
            <div className='mt-2 text-red-900'>{error}</div>

            {/* Formulaire d'ajout de tontine */}
            <div className='mt-2'>
                <div className='mt-2'>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Nom
                    </label>
                    <div className="mt-2">
                        <input id="name" name="name" type="text"
                        placeholder="Mariage" onChange={handleInputChange} required
                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Prenom
                    </label>
                    <div className="mt-2">
                        <textarea id="description" name="description" required
                        placeholder="tontine speciale pour le mariage de jean et marie" onChange={handleInputChange}
                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>
            </div>

            {/* Bouton d'ajout de tontine */}
            <button type="submit" onClick={handleSubmit}
                className="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Ajouter la tontine
            </button>
        </div>
    
    )
}