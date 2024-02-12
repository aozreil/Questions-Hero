import { IUsers } from "~/models/questionModel";
import {differenceInDays, formatDistance, format} from "date-fns";

export function getUser (userId?: number, users?: IUsers) {
    if (userId && users?.hasOwnProperty(userId)) return users[userId];
    return 'User';
}

export function getTimesAgo (date: string) {
    const today = new Date();
    const selectedDate = new Date(date);
    const difference = differenceInDays(today, selectedDate);

    if (difference <= 7) {
        return `${formatDistance(today, selectedDate)} ago`;
    } else if (difference <= 14) {
        return '1 week ago';
    } else if (difference <= 21) {
        return '2 weeks ago';
    } else if (difference <= 28) {
        return '3 weeks ago';
    } else {
        return format(date, 'MMM dd, y')
    }
}