"use client";

import { useState, useEffect } from "react";

import { Member, Month } from "@/types";
import Link from "next/link";

import SearchInput from "@/components/SearchInput";

import { useGetMembers, useDeleteMember } from "@/hooks/member";
import { useGetMonths } from "@/hooks/month";

export default function MemberList() {
    const { members, loading: loadingMembers, error: errorMembers } = useGetMembers();
    const { months, years, loading: loadingMonths, error: errorMonths } = useGetMonths();
    const { deleteMember, loading: deleting, error: deleteError } = useDeleteMember();

    const [filteredMembers, setFilteredMembers] = useState<Member[]>([]); // Liste des membres filtrés
    const [searchQuery, setSearchQuery] = useState<string>(""); // Recherche
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Année sélectionnée

    useEffect(() => {
        // Filtrer les membres en fonction de la recherche
        if (members) {
            const filtered = members.filter(
                (member) =>
                    member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    member.lastName.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredMembers(filtered);
        }
    }, [searchQuery, members]);

    /* Supprime un membre */
    const handleDelete = async (id: number) => {
        await deleteMember(id);
        setFilteredMembers((prevMembers) =>
            prevMembers.filter((member) => member.id !== id)
        );
    };

    /* Calcule le montant des cotisations d'un membre pour un mois donné */
    const getMemberDuesAmount = (member: Member, month: Month) => {
        const total = member.dues.reduce((acc, due) => {
            return due.monthId === month.id ? acc + due.amount : acc;
        }, 0);
        return total;
    };

    if (loadingMembers || loadingMonths) {
        return <div className="pt-8 pb-16 px-4 bg-white antialiased">Chargement...</div>;
    }

    if (errorMembers || errorMonths || deleteError) {
        return (
            <div className="pt-8 pb-16 px-4 bg-white antialiased text-red-600">
                {errorMembers || errorMonths || deleteError}
            </div>
        );
    }
    // Tableau pour définir l'ordre des mois
    const monthOrder = ["Janvier", "Février", "Mars", "Avril", "Mai",
        "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
      
    // Filtrer les mois en fonction de l'année sélectionnée
    const filteredMonths = months
        .filter((month) => month.year === selectedYear)
        .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));
      

    return (
        <div className="pt-8 pb-16 bg-white antialiased">
            {filteredMembers && months ? (
                <div className="px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex flex-col">
                        <div className="sm:flex sm:items-center">
                            <div className="sm:flex-auto">
                                <h1 className="text-base font-semibold text-gray-900">
                                    Liste des membres
                                </h1>
                                <p className="mt-2 text-sm text-gray-700">
                                    Voici la liste des membres de l'association.
                                </p>
                            </div>
                            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                                <Link
                                    href="member/add"
                                    className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Ajouter un membre
                                </Link>
                            </div>
                        </div>

                        {/* Barre de recherche */}
                        <SearchInput
                            searchQuery={searchQuery}
                            onSearchChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un membre"
                        />
                    </div>

                    {/* Navigation des années */}
                    <div className="mt-6 flex justify-center space-x-4">
                        {years.map((year) => (
                            <button
                                key={`year-${year}`}
                                onClick={() => setSelectedYear(year)}
                                className={`px-4 py-2 text-sm font-medium ${
                                    year === selectedYear
                                        ? "bg-indigo-600 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                } rounded-md`}
                            >
                                {year}
                            </button>
                        ))}
                    </div>

                    {/* Tableau des cotisations de chaque membre par mois */}
                    <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                            <table className="min-w-full divide-y divide-gray-300">
                            {/* Header du tableau */}
                            <thead className="bg-gray-50">
                                <tr>
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                    Nom
                                </th>
                                {filteredMonths.map((month) => (
                                    <th
                                        scope="col"
                                        className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                                        key={`month-${month.id}`}
                                    >
                                        {month.name} {month.year}
                                    </th>
                                ))}
                                <th
                                    scope="col"
                                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                                >
                                    Actions
                                </th>
                                </tr>
                            </thead>

                            {/* Corps du tableau */}
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {filteredMembers.map((member) => (
                                <tr key={`member-${member.id}`}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    <Link href={`/member/${member.id}`}>
                                        {member.firstName} {member.lastName}
                                    </Link>
                                </td>
                                {filteredMonths.map((month) => (
                                    <td
                                        className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                                        key={`month-${month.id}`}
                                    >
                                        {getMemberDuesAmount(member, month)} €
                                    </td>
                                ))}
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 space-x-2">
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="text-red-600 hover:text-red-900 cursor-pointer"
                                        disabled={deleting}
                                    >
                                        Supprimer
                                    </button>
                                    <Link
                                        href={`/member/${member.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                    >
                                        Voir les infos
                                    </Link>
                                </td>
                                </tr>
                                ))}

                                <tr>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6">
                                Total
                                </td>
                                {filteredMonths.map((month) => (
                                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-semibold sm:pr-6" key={"total-"+month.id}>
                                        {filteredMembers.reduce((total, member) => total + getMemberDuesAmount(member, month), 0)} €
                                    </td>
                                ))}
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    {/* Empty cell for alignment */}
                                </td>
                                </tr>
                            </tbody>
                            </table>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">Pas de membres ou de mois trouvés</div>
            )}
        </div>
    );
}
