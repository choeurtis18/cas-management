import { useState, useEffect } from 'react';
import { Month } from '../types';

// Hook pour récupérer tous les mois
export const useGetMonths = () => {
    const [months, setMonths] = useState<Month[]>([]);
    const [years, setYears] = useState<number[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMonths = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/month');
                if (!response.ok) {
                    throw new Error('Failed to fetch months');
                }
                const data: Month[] = await response.json();

                // Trie les mois par ordre chronologique
                const sortedMonths = data.sort((a: Month, b: Month) => {
                    const monthOrder = [ "Janvier", "Février", "Mars", "Avril",  "Mai", "Juin",  "Juillet", 
                    "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
                    return ( monthOrder.indexOf(a.name) - monthOrder.indexOf(b.name) || a.year - b.year );
                });

                setMonths(sortedMonths);

                // Extrait toutes les années uniques
                const uniqueYears = Array.from(new Set(data.map((month: Month) => month.year))) as number[];
                setYears(uniqueYears.sort((a, b) => a - b));
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMonths();
    }, []);

    return { months, years, loading, error };
};

// Hook pour récupérer un mois spécifique par ID
export const useGetMonth = (id: number) => {
    const [month, setMonth] = useState<Month | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMonth = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/month/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch month');
                }
                const data: Month = await response.json();
                setMonth(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMonth();
    }, [id]);

    return { month, loading, error };
};

// Hook pour ajouter un mois
export const useAddMonth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addMonth = async (month: Partial<Month>) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/month', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(month),
            });
            if (!response.ok) {
                throw new Error('Failed to add month');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return { addMonth, loading, error };
};

// Hook pour mettre à jour un mois
export const useUpdateMonth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateMonth = async (id: number, updatedMonth: Partial<Month>) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/month/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedMonth),
            });

            if (!response.ok) {
                throw new Error('Failed to update month');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return { updateMonth, loading, error };
};

// Hook pour supprimer un mois
export const useDeleteMonth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteMonth = async (id: number) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/month/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete month');
            }
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return { deleteMonth, loading, error };
};
