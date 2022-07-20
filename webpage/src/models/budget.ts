export interface Category {
    id: string;
    label: string;
    budget: number;
    spent?: number;
    cost_center_ids: string[];
}

export interface CostCenter {
    id: string;
    title: string;
    category: string;
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