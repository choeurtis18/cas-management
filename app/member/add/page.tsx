'use client'

import { useState } from 'react'

import { useAddMember } from '@/hooks/member';

export default function AddMember(){
    const { addMember } = useAddMember();
    const [member, setMember] = useState({
        firstName: "",
        lastName: "",
    }); // Informations du membre
    const [error, setError] = useState(""); // Message d'erreur

    {/* Fonction pour gérer les changements des champs de saisie */}
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMember({ ...member, [name]: value });
    };

    {/* Fonction pour ajouter un membre */}
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addMember(member);
            window.location.href = "/membre";
        }
        catch (error) {
            console.error("Error adding member:", error);
            setError("Erreur pendant l'ajout de member");
        }
    }

    return ( 
        <div className="pt-8 pb-16 bg-white antialiased px-4">
            <h1 className="text-base font-semibold text-gray-900">Ajouter un menbre</h1>

            {/* Message d'erreur */}
            <div className='mt-2 text-red-900'>{error}</div>
            
            {/* Formulaire d'ajout de membre */}
            <div className='mt-2'>
                <div className='mt-2'>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Nom
                    </label>
                    <div className="mt-2">
                        <input id="lastName" name="lastName" type="text"
                        placeholder="jackson" onChange={handleInputChange} required
                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Prenom
                    </label>
                    <div className="mt-2">
                        <input id="firstName" name="firstName" type="text"
                        placeholder="micheal" onChange={handleInputChange} required
                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>
            </div>

            {/* Bouton pour ajouter le membre */}
            <button type="submit" onClick={handleSubmit}
                className="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >Ajouter le member</button>
        </div>
    )
}