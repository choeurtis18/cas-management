"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

import { Member } from "@/types";
import SearchInput from "@/components/SearchInput";

import { useGetCategory } from "@/hooks/category";
import { useGetMonths } from "@/hooks/month";
import { useGetMembers } from "@/hooks/member";

export default function CategoryDetails({
  params: paramsPromise,
}: {
  params: Promise<{ id: string }>;
}) {
  const params = React.use(paramsPromise);
  const categoryId = parseInt(params.id);

  const { category, loading: loadingCategory, error: errorCategory } = useGetCategory(categoryId);
  const { members, loading: loadingMembers, error: errorMembers } = useGetMembers();
  const { months, years, loading: loadingMonths, error: errorMonths } = useGetMonths();

  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]); // Membres filtrés
  const [searchQuery, setSearchQuery] = useState<string>(""); // Recherche par nom
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Année sélectionnée

  // Filtrer les membres par recherche
  useEffect(() => {
    const filtered = members.filter(
      (member) =>
        member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.lastName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  // Mois filtrés par année sélectionnée
  const monthOrder = ["Janvier", "Février", "Mars", "Avril", "Mai",
    "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  // Filtrer les mois en fonction de l'année sélectionnée
  const filteredMonths = months
      .filter((month) => month.year === selectedYear)
      .sort((a, b) => monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name));

  /**
   * Formate une date en une chaîne lisible.
   */
  function formatDate(date: string | Date): string {
    const days = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];
    const months = [
      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
    ];

    const d = new Date(date);
    const dayName = days[d.getDay() - 1]; // getDay() commence à 1 pour lundi
    const day = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, "0");
    const minutes = d.getMinutes().toString().padStart(2, "0");

    return `${dayName} ${day} ${monthName} ${year} - ${hours}h${minutes}`;
  }

  if (loadingCategory || loadingMembers || loadingMonths) {
    return <div className="text-center">Chargement...</div>;
  }

  if (errorCategory || errorMembers || errorMonths) {
    return <div className="text-center text-red-600">Erreur lors du chargement des données.</div>;
  }

  return (
    <div className="pt-8 pb-16 bg-white antialiased">
      {category ? (
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col">
            <div className="sm:flex sm:items-center">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold text-gray-900">{category.name}</h1>
                <p className="text-sm text-gray-700">
                  Dernière mise à jour le {formatDate(category.update_date)}
                </p>
                <p className="mt-2 text-sm">{category.description}</p>
              </div>
              <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
                <Link
                  href={`/category/${categoryId}/update`}
                  className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                >
                  Mettre à jour
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

          {/* Tableau des cotisations */}
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                        >
                          Membres
                        </th>
                        {filteredMonths.map((month) => (
                          <th
                            key={`month-${month.id}`}
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                          >
                            {month.name} {month.year}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredMembers.map((member) => {
                      return (
                        <tr key={`member-${member.id}`}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          <Link href={`/member/${member.id}`}>
                          {member.firstName} {member.lastName}
                          </Link>
                        </td>
                        {filteredMonths.map((month) => (
                          <td
                          key={`category-${category.id}-month-${month.id}`}
                          className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6"
                          >
                          {member.dues.find((due) => due.monthId === month.id)?.amount || "0"} €
                          </td>
                        ))}
                        </tr>
                      );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">Catégorie introuvable.</div>
      )}
    </div>
  );
}
