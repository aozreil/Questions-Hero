import { Link } from "@remix-run/react";
import { IUser } from "~/models/questionModel";
import { getUserSlug } from "~/utils";
import { PRODUCT_NAME } from "~/config/enviromenet";


interface IProps {
  user?: IUser;
  className?: string;
}

export function UserNameLink({ user, className }: IProps) {
  if (user?.view_name && user?.user_id) {
    return <din className={className}>
      {user?.view_name}
    </din>;
  }

  return <p className={className}>
    Answered By {PRODUCT_NAME} User
  </p>;
}
