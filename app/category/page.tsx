"use client";

import { useState, useEffect } from "react";

import { Category, Month } from "../../types";
import Link from "next/link";
import SearchInput from "@/components/SearchInput";

import { useGetMonths } from "@/hooks/month";
import { useGetCategories, useDeleteCategory } from "@/hooks/category";

export default function CategoryList() {
    const { months, years, loading: loadingMonths, error: errorMonths } = useGetMonths();
    const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
    const { deleteCategory } = useDeleteCategory();

    const [filteredCategories, setFilteredCategories] = useState<Category[]>([]); // Liste des catégories filtrées
    const [searchQuery, setSearchQuery] = useState<string>(''); // Recherche
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Année sélectionnée

    {/* Filtre les catégories en fonction de la recherche */}
    useEffect(() => {
        if(categories) {
            const filtered = categories.filter(category =>
                category.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCategories(filtered);
        }
    }, [searchQuery, categories]);
    
    if (loadingMonths || loadingCategories) {
        return <div className="pt-8 pb-16 px-4 bg-white antialiased">Chargement...</div>;
    }

    if (errorMonths || errorCategories) {
        return (
            <div className="pt-8 pb-16 px-4 bg-white antialiased text-red-600">
                {errorCategories || errorMonths}
            </div>
        );
    }

    {/* Filtre les mois en fonction de l'année sélectionnée */}
    const filteredMonths = months.filter((month) => month.year === selectedYear);

    {/* Supprime une catégorie */}
    const handleDelete = (id: number) => async () => {
        deleteCategory(id);
        setFilteredCategories(categories.filter((category) => category.id !== id));
    }


    {/* Calcule le montant total des cotisations d'une catégorie pour un mois donné */}
    const getCategoryDuesAmount = (category: Category, month : Month) => {
        var total = 0;
        category.dues.forEach(due => {
            if (due.monthId === month.id) {
                total += due.amount;
            }
        });

        return total;
    }

    return (
        <div className="pt-8 pb-16 bg-white antialiased">
            {
            filteredCategories && months ? (
            <div className="px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col">
                    <div className="sm:flex sm:items-center">
                        <div className="sm:flex-auto">
                        <h1 className="text-base font-semibold text-gray-900">Liste des tontines</h1>
                        <p className="mt-2 text-sm text-gray-700">
                            Voici la liste tontines de l'association.
                        </p>
                        </div>
                        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                            <Link href="category/add"
                                className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Ajouter une tontine
                            </Link>
                        </div>
                    </div>
                    
                    {/* Barre de recherche */}
                    <SearchInput 
                        searchQuery={searchQuery}
                        onSearchChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher une categorie"
                    />
                </div>

                {/* Navigation des années */}
                <div className="mt-6 flex justify-center space-x-4">
                {years.map((year) => (
                    <button
                    key={"year-"+year}
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

                {/* Tableau des mois et cotisations */}
                <div className="mt-8 flow-root">
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                Nom
                                </th>
                                
                                {filteredMonths.map((month) => (
                                    <th scope="col" className="px-3 py-3 text-left text-sm font-semibold text-gray-900" key={"month-"+month.id}>
                                        {month.name} {month.year}
                                    </th>
                                ))}

                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredCategories.map((category) => (
                                <tr key={"category-"+category.id}>
                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                    <Link href={"/category/"+category.id}>{category.name}</Link>
                                </td>
                                {filteredMonths.map((month) => (
                                    <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6" key={"month-"+month.id}>
                                        {getCategoryDuesAmount(category, month)} €
                                    </td>
                                ))}
                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                                    <div onClick={handleDelete(category.id)} className="text-red-600 hover:text-red-900 cursor-pointer">
                                        Supprimer
                                    </div>
                                    <Link href={"/category/"+category.id} className="text-indigo-600 hover:text-indigo-900 cursor-pointer">
                                        Voir les infos
                                    </Link>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            ) : <div className="text-center">pas de menbres ou de mois trouvés</div>
            }
        </div>
    );
}