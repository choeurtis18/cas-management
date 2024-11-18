"use client";

import React, { useState, useEffect } from "react";
import { Month, Member } from "../../types";
import Link from "next/link";

import { useGetMembers, useUpdateMember } from "@/hooks/member";
import { useGetMonths } from "@/hooks/month";
import { useGetCategories } from "@/hooks/category";

export default function DueList() {
  const { members, loading: loadingMembers, error: errorMembers } = useGetMembers();
  const { months, years, loading: loadingMonths, error: errorMonths } = useGetMonths();
  const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
  const { updateMember } = useUpdateMember();

  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]); // Liste des membres filtrés
  const [filteredMonth, setFilteredMonth] = useState<Month | null>(null); // Mois filtré
  const [selectedMonth, setSelectedMonth] = useState<string>(""); // Mois sélectionné
  const [selectedYear, setSelectedYear] = useState<number | "">(""); // Année sélectionnée
  const [errorMessage, setErrorMessage] = useState<string>(""); // Message d'erreur

  // Initialiser les membres filtrés
  useEffect(() => {
    setFilteredMembers(members);
  }, [members]);

  if (loadingMembers || loadingMonths || loadingCategories) {
    return <div className="pt-8 pb-16 px-4 bg-white antialiased">Chargement...</div>;
  }

  if (errorMembers || errorMonths || errorCategories) {
    return (
      <div className="pt-8 pb-16 px-4 bg-white antialiased text-red-600">
        {errorMembers || errorMonths || errorCategories}
      </div>
    );
  }

  /* Recherche du mois sélectionné */
  const handleSearch = () => {
    if (!selectedMonth || !selectedYear) {
      setErrorMessage("Veuillez sélectionner un mois et une année.");
      return;
    }

    const month = months.find(
      (m) => m.name === selectedMonth && m.year === selectedYear
    );

    if (month) {
      setFilteredMonth(month);
      setErrorMessage("");
    } else {
      setErrorMessage("Aucun mois trouvé pour cette sélection.");
    }
  };

  /* Mettre à jour la cotisation d'un membre */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    memberId: number,
    categoryId: number
  ) => {
    const { value } = e.target;

    setFilteredMembers((prevMembers) =>
      prevMembers.map((member) => {
        if (member.id === memberId) {
          const updatedDues = member.dues.map((due) => {
            if (
              due.categoryId === categoryId &&
              due.monthId === filteredMonth?.id
            ) {
              return { ...due, amount: parseFloat(value) || 0 };
            }
            return due;
          });
          return { ...member, dues: updatedDues };
        }
        return member;
      })
    );
  };

  /* Soumettre les mises à jour des cotisations */
  const handleSubmit = async () => {
    if (!filteredMonth) {
      alert("Veuillez sélectionner un mois avant de soumettre.");
      return;
    }

    try {
      const updates = filteredMembers.map((member) => ({
        id: member.id,
        dues: member.dues.filter((due) => due.monthId === filteredMonth.id),
      }));

      await Promise.all(
        updates.map((update) => updateMember(update.id, { dues: update.dues }))
      );

      alert("Cotisations mises à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      setErrorMessage("Erreur lors de la mise à jour des cotisations.");
    }
  };

  return (
    <div className="pt-8 pb-16 bg-white antialiased">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">
              Liste des cotisations
            </h1>
            <p className="mt-2 text-sm text-gray-700">
              Voici la liste des cotisations de l'association.
            </p>
          </div>

          {/* Sélection du mois et de l'année */}
          <div className="mt-4 flex space-x-4 sm:mt-0">
            <select
              value={selectedYear}
              onChange={(e) =>
                setSelectedYear(
                  e.target.value === "" ? "" : parseInt(e.target.value)
                )
              }
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner une année</option>
              {years.map((year) => (
                <option key={`year-${year}`} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner un mois</option>
              {months.map((month) => (
                <option key={`month-${month.id}`} value={month.name}>
                  {month.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Chercher
            </button>
          </div>
        </div>

        {/* Erreur */}
        {errorMessage && <div className="mt-4 text-red-600">{errorMessage}</div>}

        {/* Tableau des cotisations */}
        {filteredMonth && members.length > 0 && categories.length > 0 && (
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
                          Nom
                        </th>
                        {categories.map((category) => (
                          <th
                            scope="col"
                            className="px-3 py-3 text-left text-sm font-semibold text-gray-900"
                            key={`category-${category.id}`}
                          >
                            {category.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredMembers.map((member) => (
                        <tr key={`member-${member.id}`}>
                          <td className="pl-4 pr-3 py-2 text-sm text-gray-900 sm:pl-6">
                            <Link href={`/member/${member.id}`}>
                              {member.firstName} {member.lastName}
                            </Link>
                          </td>
                          {categories.map((category) => (
                            <td
                              className="pl-3 pr-4 py-2 text-sm text-gray-900 sm:pr-6"
                              key={`category-${category.id}`}
                            >
                              <input
                                type="number"
                                value={
                                  member.dues.find(
                                    (due) =>
                                      due.categoryId === category.id &&
                                      due.monthId === filteredMonth.id
                                  )?.amount || 0
                                }
                                onChange={(e) =>
                                  handleInputChange(
                                    e,
                                    member.id,
                                    category.id
                                  )
                                }
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Bouton de mise à jour */}
            <button
              onClick={handleSubmit}
              className="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Mettre à jour les cotisations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
