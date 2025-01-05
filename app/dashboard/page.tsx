'use client';

import Link from 'next/link';
import { useState } from 'react';

import { useGetMembers } from '@/hooks/member';
import { useGetCategories } from '@/hooks/category';
import { useGetDues } from '@/hooks/due';

export default function Home() {
  const { members, loading: loadingMembers, error: errorMembers } = useGetMembers();
  const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
  const { dues, loading: loadingDues, error: errorDues } = useGetDues();

  const [searchMember, setSearchMember] = useState('');
  const [searchCategory, setSearchCategory] = useState('');

  if (loadingMembers || loadingCategories || loadingDues) {
    return <div className="pt-8 pb-16 px-4 bg-white antialiased">Chargement...</div>;
  }

  if (errorMembers || errorCategories || errorDues) {
    return (
      <div className="pt-8 pb-16 px-4 bg-white antialiased text-red-600">
        {errorMembers || errorCategories || errorDues}
      </div>
    );
  }

  const totalDues = dues.reduce((acc, due) => acc + due.amount, 0);

  const formatDate = (date: string | Date): string => {
    try {
      const d = new Date(date);
      return new Intl.DateTimeFormat('fr-FR', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(d);
    } catch {
      return 'Date invalide';
    }
  };

  const filteredMembers = members.filter((member) =>
    `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchMember.toLowerCase())
  );

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchCategory.toLowerCase())
  );

  return (
    <div className="pt-8 pb-16 px-4 bg-white antialiased">
      <h3 className="text-base font-semibold text-gray-900">Dashboard</h3>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Nombre de tontines</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {categories.length}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Nombre de membres</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {members.length}
          </dd>
        </div>

        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">Cotisation totale</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {totalDues} €
          </dd>
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-5">
        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold text-gray-900">Membres</h3>
          <div className="my-4">
            <input
              type="text"
              placeholder="Rechercher un membre"
              value={searchMember}
              onChange={(e) => setSearchMember(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <ul className="flex flex-col gap-y-4 divide-y divide-gray-100">
            {filteredMembers.map((member) => (
              <li key={member.id} className="flex justify-between gap-x-6">
                <Link
                  href={`/member/${member.id}`}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  {member.firstName} {member.lastName}
                </Link>
                <span className="text-sm text-gray-500">{formatDate(member.creation_date)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
          <h3 className="text-base font-semibold text-gray-900">Tontines</h3>
          <div className="my-4">
            <input
              type="text"
              placeholder="Rechercher une tontine"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          <ul className="flex flex-col gap-y-4 divide-y divide-gray-100">
            {filteredCategories.map((category) => (
              <li key={category.id} className="flex justify-between gap-x-6">
                <Link
                  href={`/category/${category.id}`}
                  className="text-sm font-medium text-indigo-600 hover:underline"
                >
                  {category.name}
                </Link>
                <span className="text-sm text-gray-500">{formatDate(category.creation_date)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
