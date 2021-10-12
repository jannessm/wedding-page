export interface BudgetData {
    budget: number;
    spent_total: number;
    categories: Category[];
    cost_centers: CostCenter[];
}

export interface Category {
    id: string;
    label: string;
    budget: number;
    spent: number;
    cost_center_ids: string[];
}

export interface CostCenter {
    id: string;
    category: string;
    amount: number;
    paid: boolean;
    title: string;
    description: string;
    per_person: boolean;
}