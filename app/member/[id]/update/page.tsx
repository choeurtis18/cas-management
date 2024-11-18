'use client'

import React, { useState, useEffect } from "react";

import { useGetMember, useUpdateMember } from '@/hooks/member';

export default function UpdateMember({ 
    params: paramsPromise,
}: {
    params: Promise<{ id: string }>;
}) {
    const params = React.use(paramsPromise); // Récupère les paramètres de l'URL
    const memberId = parseInt(params.id); // Convertit l'ID en nombre
    const [memberUpdate, setMemberUpdate] = useState({
        firstName: "",
        lastName: "",
    }); // Informations du membre
    const { member, loading: loadingMember, error: errorMember } = useGetMember(memberId);
    const { updateMember, loading: loadingUpdate, error: errorUpdate } = useUpdateMember();

    if (loadingMember) {
        return <div className="pt-8 pb-16 px-4 bg-white antialiased">Chargement...</div>;
    }

    if (errorMember) {
        return (
        <div className="pt-8 pb-16 px-4 bg-white antialiased text-red-600">
            {errorMember}
        </div>
        );
    }

    {/* Fetch les informations du membre */}
    useEffect(() => {
        if(member) {
            setMemberUpdate({
                firstName: member.firstName,
                lastName: member.lastName,
            });
        }
    }, [member]);

    {/* Fonction pour gérer les changements des champs de saisie */}
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setMemberUpdate({ ...memberUpdate, [name]: value });
    };

    {/* Fonction pour mettre à jour un membre */}
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await updateMember(memberId, memberUpdate);
            window.location.href = "/member/"+memberId;
        }
        catch (error) {
            console.error("Error updating member:", error);
        }
    }

    return ( 
        <div className="pt-8 pb-16 bg-white antialiased px-4">
           {memberUpdate ? (
            <>
            <h1 className="text-base font-semibold text-gray-900">Mettre à jour le menbre</h1>

            {/* Message d'erreur */}
            <div className='mt-2 text-red-900'>{errorMember}</div>
            
            {/* Formulaire de mise à jour de membre */}
            <div className='mt-2'>
                <div className='mt-2'>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Nom
                    </label>
                    <div className="mt-2">
                        <input id="lastName" name="lastName" type="text" value={memberUpdate.lastName}
                        onChange={handleInputChange} required
                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                    Prenom
                    </label>
                    <div className="mt-2">
                        <input id="firstName" name="firstName" type="text" value={memberUpdate.firstName}
                        onChange={handleInputChange} required
                        className="block w-full rounded-md border-0 p-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                        />
                    </div>
                </div>
            </div>

            {/* Bouton pour mettre à jour le membre */}
            <button type="submit" onClick={handleSubmit}
                className="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            Ajouter le member
            </button>
            </>
        ) : ( <div>Chargement...</div> )} 
        </div>
    )
}