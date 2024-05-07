import UserProfile from "~/components/UI/UserProfile";
import { IUser } from "~/models/questionModel";
import { useState } from "react";
import { getCreatedAt } from "~/utils";

interface Props {
  user: IUser;
  createdAt?: string;
}

export default function PostedByUser({ user, createdAt }: Props) {
  const [postDate] = useState(() => getCreatedAt(createdAt));
  return (
    <div className='flex gap-3'>
      <UserProfile user={user} />
      <div className='flex flex-col text-sm text-black pr-2 overflow-x-hidden'>
        <p className='text-sm font-bold capitalize'>{user?.view_name ?? 'Answered By Askgram User'}</p>
        {!!postDate && <p className='mt-1 mb-4 text-xs'>{postDate}</p>}
      </div>
    </div>
  )
}