'use client';

import Link from 'next/link';

import { useGetMembers } from '@/hooks/member';
import { useGetCategories } from '@/hooks/category';
import { useGetDues } from '@/hooks/due';

export default function Home() {
  const { members, loading: loadingMembers, error: errorMembers } = useGetMembers();
  const { categories, loading: loadingCategories, error: errorCategories } = useGetCategories();
  const { dues, loading: loadingDues, error: errorDues } = useGetDues();

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

  // Calcul du total des cotisations
  const totalDues = dues.reduce((acc, due) => acc + due.amount, 0);

  // Formate une date de manière lisible
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

  return (
    <div className="pt-8 pb-16 px-4 bg-white antialiased">
      <h3 className="text-base font-semibold text-gray-900">Dashboard</h3>

      {errorCategories || errorMembers || errorDues ? (
        <div className="text-red-600">{errorCategories || errorMembers || errorDues}</div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {/* Section Statistiques */}
            <div
              key="category"
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">Nombre de tontines</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {categories.length}
              </dd>
            </div>

            {/* Section Membres */}
            <div
              key="member"
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">Nombre de membres</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {members.length}
              </dd>
            </div>

            {/* Section Cotisations */}
            <div
              key="dues"
              className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
            >
              <dt className="truncate text-sm font-medium text-gray-500">Cotisation totale</dt>
              <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
                {totalDues} €
              </dd>
            </div>
          </div>

          <div className="flex flex-auto gap-4 mt-5 flow-root">
            {/* Section Membres */}
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
              <div className="-ml-4 -mt-2 mb-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-2">
                  <h3 className="text-base font-semibold text-gray-900">Membres</h3>
                </div>
                <div className="ml-4 mt-2 shrink-0">
                  <Link
                    href="/membre/add"
                    className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Créer membre
                  </Link>
                </div>
              </div>

              <ul className="flex flex-col gap-y-4 divide-y divide-gray-100">
                {members.map((member) => (
                  <li key={member.id} className="flex justify-between gap-x-6">
                    <Link
                      href={`/member/${member.id}`}
                      className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                      {member.firstName} {member.lastName}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {formatDate(member.creation_date)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Section Tontines */}
            <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
              <div className="-ml-4 -mt-2 mb-4 flex flex-wrap items-center justify-between sm:flex-nowrap">
                <div className="ml-4 mt-2">
                  <h3 className="text-base font-semibold text-gray-900">Tontines</h3>
                </div>
                <div className="ml-4 mt-2 shrink-0">
                  <Link
                    href="/category/add"
                    className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Créer une tontine
                  </Link>
                </div>
              </div>

              <ul className="flex flex-col gap-y-4 divide-y divide-gray-100">
                {categories.map((category) => (
                  <li key={category.id} className="flex justify-between gap-x-6">
                    <Link
                      href={`/category/${category.id}`}
                      className="text-sm font-medium text-indigo-600 hover:underline"
                    >
                      {category.name}
                    </Link>
                    <span className="text-sm text-gray-500">
                      {formatDate(category.creation_date)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
