import { Link } from "@remix-run/react";
import { IUser } from "~/models/questionModel";
import { getUserSlug } from "~/utils";


interface IProps {
  user?: IUser;
  className?: string;
}

export function UserNameLink({ user, className }: IProps) {
  if (user?.view_name && user?.user_id) {
    return <Link className={className} to={`/user/${getUserSlug(user)}`}>
      {user?.view_name}
    </Link>;
  }

  return <p className={className}>
    Answered By Askgram User
  </p>;
}
