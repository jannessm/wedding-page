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
    uuid: string;
    name: string;
    lastname: string;
    age: AGE_CATEGORIES;
    isRegistered: boolean;
    diet: DIETS | string;
    allergies: string;
    song: string;
}

export enum AGE_CATEGORIES {
    INFANT = "INFANT",
    CHILD = "CHILD",
    ADULT = "ADULT"
};

export const AGE_CATEGORY_LABELS: {[key: string]: string} = {
    INFANT: "Kind (0 - 11)",
    CHILD: "Jugendlich (12 - 17)",
    ADULT: "Erwachsen (ab 18)"
};

export const AGE_CATEGORY_ICONS: {[key: string]: string} = {
    INFANT: "toys",
    CHILD: "school",
    ADULT: "person"
};

export enum DIETS {
    VEGAN = "VEGAN",
    VEGETARIAN = "VEGETARIAN",
    // GLUTEN_FREE = "GLUTEN_FREE", // may be combined with others, so more allergic than diet
    NORMAL = "NORMAL"
}

export const DIET_LABELS: {[key: string]: string} = {
    VEGAN: "vegan",
    VEGETARIAN: "vegetarisch",
    // GLUTEN_FREE: "glutenfrei",
    NORMAL: "normal"
}

export const DIET_ICONS: {[key: string]: string} = {
    VEGAN: "vegan",
    VEGETARIAN: "vegetarian",
    // GLUTEN_FREE: "gluten-free",
    NORMAL: ""
}