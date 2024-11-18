// Enum pour le rôle des utilisateurs
export enum Role {
    USER = "USER",
    ADMIN = "ADMIN",
}

// Interface pour User
export interface User {
    id: number;
    username: string;
    email: string;
    password: string;
    role: Role;
}

// Interface pour Member
export interface Member {
    id: number;
    firstName: string;
    lastName: string;
    creation_date: Date;
    update_date: Date;
    dues: Dues[]; // Liste des cotisations du menbre
    categories: Category[]; // Catégories auxquelles le menbre appartient
}

// Interface pour Category
export interface Category {
    id: number;
    name: string;
    description: string;
    creation_date: Date;
    update_date: Date;
    members: Member[]; // menbres appartenant à la catégorie
    dues: Dues[]; // Cotisations de cette catégorie
}

// Interface pour Month
export interface Month {
    id: number;
    name: string; // Nom du mois (e.g., "Janvier", "Février")
    year: number; // Année associée au mois
    dues: Dues[]; // Cotisations associées à ce mois
}

// Interface pour Dues
export interface Dues {
    id: number;
    amount: number; // Montant de la cotisation
    isLate: boolean; // Indique si la cotisation est en retard
    memberId: number; // ID du menbre lié à cette cotisation
    categoryId: number; // ID de la catégorie liée à cette cotisation
    monthId: number; // ID du mois lié à cette cotisation
    member: Member; // Référence au menbre associé
    category: Category; // Référence à la catégorie associée
    month: Month; // Référence au mois associé
}
