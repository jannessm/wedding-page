export interface User {
    name: string;
    firstLogin: boolean;
    isAdmin: boolean;
    firstPassword: string;
    guests: Guest[];
}

export interface UserResponse {
    [key: string]: User;
}

export interface Guest {
    name: string;
    lastname: string;
    age: AgeCategories;
    isRegistered: boolean;
    diet: DIETS;
    allergies: string;
    song: string;
}

export enum AgeCategories {
    INFANT = "Kind (0 - 12)",
    CHILD = "Kind (13 - 18)",
    ADULT = "Erwachsen (ab 19)"
};

export enum DIETS {
    VEGAN = "vegan",
    VEGETARIAN = "vegetarisch",
    GLUTEN_FREE = "glutenfrei",
    NORMAL = ""
}