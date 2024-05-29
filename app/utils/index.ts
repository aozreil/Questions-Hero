import { IUser, IUsers } from "~/models/questionModel";
import {differenceInDays, formatDistance, format} from "date-fns";

export function getUser (userId?: number, users?: IUsers) {
    if (userId && users?.hasOwnProperty(userId)) return users[userId]?.view_name;
    return 'Askgram User';
}


export function getUserSlug(user: IUser){
    return user.view_name?.trim().replace(/\s/g, '-') + '-' + user.user_id
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

export function getCreatedAt (createdAt?: string) {
   return createdAt ? getTimesAgo(createdAt) : undefined
}

export function getUserInitials (userName?: string) {
    if (!userName) return 'A';
    const nameFields = userName?.split(' ');
    const firstInitial = nameFields?.[0]?.charAt(0)?.toUpperCase() ?? '';
    const secondInitial = nameFields?.[1]?.charAt(0)?.toUpperCase() ?? '';

    return `${firstInitial}${secondInitial}`
}

export function debounce<Params extends any[]>(
  func: (...args: Params) => void,
  delay: number
) {
    let timer: NodeJS.Timeout | undefined = undefined;
    return function (this: any, ...args: Params) {
        if (timer === undefined) {
            func.apply(this, args);
        }

        clearTimeout(timer);
        timer = setTimeout(() => timer = undefined, delay);
        return timer;
    }
}

export function debounceLeading<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
    let timeoutId: ReturnType<typeof setTimeout>;

    return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

export function countRealCharacters(str: string) {
    const realString = str.replace(/\s/g, '');
    return realString.length;
}
