"use client";

import React, { useState, useEffect } from "react";
import { Month, Member } from "@/types";
import Link from "next/link";

import { useGetMembers, useUpdateMember } from "@/hooks/member";
import { useGetMonths, useAddMonth } from "@/hooks/month";
import { useGetCategories } from "@/hooks/category";

export default function DueList() {
  const { members, loading: loadingMembers, error: errorMembers } = useGetMembers();
  const { months, years, loading: loadingMonths, error: errorMonths, refetch: refetchMonths } = useGetMonths();
  const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
  const { updateMember } = useUpdateMember();
  const { addMonth } = useAddMonth();

  const yearsChoices = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
  const monthsChoices = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [filteredMonth, setFilteredMonth] = useState<Month | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<number | "">("");
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  const handleSearch = async () => {
    if (!selectedMonth || !selectedYear) {
      setErrorMessage("Veuillez sélectionner un mois et une année.");
      return;
    }

    let month = months.find((m) => m.name === selectedMonth && m.year === selectedYear);

    if (month) {
      setFilteredMonth(month);
      setErrorMessage("");
    } else {
      try {
        const newMonth = await addMonth({ name: selectedMonth, year: selectedYear });
        const updatedMonths = await refetchMonths();
        month = updatedMonths.find((m) => m.name === newMonth.name && m.year === newMonth.year);

        if (month) {
          setFilteredMonth(month);
          setErrorMessage("");
        } else {
          setErrorMessage("Le mois a été ajouté mais ne peut pas être trouvé.");
        }
      } catch (error) {
        setErrorMessage("Erreur lors de l'ajout du mois.");
        console.error(error);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, memberId: number, categoryId: number) => {
    const { value } = e.target;
    setFilteredMembers((prevMembers) =>
      prevMembers.map((member) =>
        member.id === memberId
          ? {
              ...member,
              dues: member.dues.map((due) =>
                due.categoryId === categoryId && due.monthId === filteredMonth?.id
                  ? { ...due, amount: parseFloat(value) || 0 }
                  : due
              ),
            }
          : member
      )
    );
  };

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

      await Promise.all(updates.map((update) => updateMember(update.id, { dues: update.dues })));
      alert("Cotisations mises à jour avec succès !");
    } catch (error) {
      setErrorMessage("Erreur lors de la mise à jour des cotisations.");
      console.error(error);
    }
  };

  return (
    <div className="pt-8 pb-16 bg-white antialiased">
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">Liste des cotisations</h1>
            <p className="mt-2 text-sm text-gray-700">Voici la liste des cotisations de l'association.</p>
          </div>
          <div className="mt-4 flex space-x-4 sm:mt-0">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value === "" ? "" : parseInt(e.target.value))}
              className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner une année</option>
              {yearsChoices.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Sélectionner un mois</option>
              {monthsChoices.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Chercher
            </button>
          </div>
        </div>

        {/* Error */}
        {errorMessage && <div className="mt-4 text-red-600">{errorMessage}</div>}

        {/* Table */}
        {filteredMonth && (
          <div className="mt-8 flow-root">
            <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                <div className="overflow-hidden shadow ring-1 ring-black/5 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Nom</th>
                        {categories.map((category) => (
                          <th key={category.id} className="px-3 py-3 text-left text-sm font-semibold text-gray-900">
                            {category.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {filteredMembers.map((member) => (
                        <tr key={member.id}>
                          <td className="pl-4 pr-3 py-2 text-sm text-gray-900 sm:pl-6">
                            <Link href={`/member/${member.id}`}>
                              {member.firstName} {member.lastName}
                            </Link>
                          </td>
                          {categories.map((category) => (
                            <td key={category.id} className="px-3 py-2">
                              <input
                                type="number"
                                value={
                                  member.dues.find(
                                    (due) =>
                                      due.categoryId === category.id && due.monthId === filteredMonth.id
                                  )?.amount || 0
                                }
                                onChange={(e) => handleInputChange(e, member.id, category.id)}
                                className="block w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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

            {/* Submit */}
            <button
              onClick={handleSubmit}
              className="mt-4 inline-block rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
            >
              Mettre à jour les cotisations
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
