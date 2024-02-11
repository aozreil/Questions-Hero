import { Users } from "~/models/questionModel";

export function getUser (userId?: number, users?: Users) {
    if (userId && users?.hasOwnProperty(userId)) return users[userId];
    return 'User';
}