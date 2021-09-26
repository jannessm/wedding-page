export interface User {
    name: string;
    firstLogin: boolean;
    isAdmin: boolean;
    firstPassword: string;
    guests: Guest[];
}

export interface Guest {
    name: string;
    lastname: string;
    age: AgeCategories;
}

export enum AgeCategories {
    INFANT = "Kind (0 - 12)",
    CHILD = "Kind (13 - 18)",
    ADULT = "Erwachsen (ab 19)"
};