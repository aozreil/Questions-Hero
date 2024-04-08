import { getUserInitials } from "~/utils";
import { IUser } from "~/models/questionModel";
import clsx from "clsx";

interface Props {
  user?: IUser;
  className?: string;
}

export default function UserProfile({ user, className }: Props) {
  return (
    <div
      className={clsx(`overflow-hidden h-11 w-11 bg-[#002237] text-white text-sm flex items-center justify-center
        rounded-full border border-[#070707] flex-shrink-0 font-semibold`, className,
        user?.picture && 'border-none')}
    >
      {user?.picture
        ? <img src={user.picture} alt='user-profile' className='w-full h-full' />
        : getUserInitials(user?.view_name)
      }
    </div>
  )
}