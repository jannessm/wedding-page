import { Guest } from "./user";

export interface GuestTable extends Guest{
    user: string;
    editMode: boolean;
}

export interface UserTable {
    name: string;
    isAdmin: boolean;
    guests: string[];
}