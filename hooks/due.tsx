import { useState, useEffect } from 'react';
import { Dues } from '../types';

// Hook pour récupérer toutes les cotisations
export const useGetDues = () => {
    const [dues, setDues] = useState<Dues[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDues = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/due');
                if (!response.ok) {
                    throw new Error('Failed to fetch dues');
                }
                const data: Dues[] = await response.json();
                setDues(data);
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

        fetchDues();
    }, []);

    return { dues, loading, error };
};

// Hook pour récupérer une cotisation spécifique par ID
export const useGetDue = (id: number) => {
    const [due, setDue] = useState<Dues | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDue = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/due/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch due');
                }
                const data: Dues = await response.json();
                setDue(data);
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

        fetchDue();
    }, [id]);

    return { due, loading, error };
}

// Hook pour ajouter une cotisation
export const useAddDue = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const addDue = async (due: Partial<Dues>) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/due', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(due),
            });
            if (!response.ok) {
                throw new Error('Failed to add due');
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

    return { addDue, loading, error };
};

// Hook pour mettre à jour une cotisation
export const useUpdateDue = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const updateDue = async (id: number, updatedDue: Partial<Dues>) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/due/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedDue),
            });

            if (!response.ok) {
                throw new Error('Failed to update due');
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

    return { updateDue, loading, error };
};

// Hook pour supprimer une cotisation
export const useDeleteDue = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteDue = async (id: number) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/api/due/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete due');
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

    return { deleteDue, loading, error };
};
