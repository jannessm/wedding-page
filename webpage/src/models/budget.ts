export interface Category {
    id: number;
    label: string;
    budget: number;
    spent?: number;
}

export interface CostCenter {
    id: number;
    title: string;
    category: number | null | undefined;
    amount: number;
    paid: boolean;
    per_person: boolean;
    editMode?: boolean;
    isNew?: boolean;
}

export enum FilterKeywords {
    PAID = 'bezahlt',
    PER_PERSON = 'pPers'
}