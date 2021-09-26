import { Guest } from "./user";

export interface GuestTable extends Guest{
    user: string;
    editMode: boolean;
}