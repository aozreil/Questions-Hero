import { IUser } from "~/models/questionModel";
import { Fragment, JSX } from "react";
import UserIcon from "~/components/icons/UserIcon";
import EmailIcon from "~/components/icons/EmailIcon";


interface IProps {
  user: IUser;
}


const InfoToDisplay = [
  {
    title: "Name",
    key: "view_name",
    Icon: UserIcon
  },
  {
    title: "Email address",
    key: "email",
    Icon: EmailIcon
  }
];
export default function AboutUsSection({ user }: IProps) {
  return <div>
    {InfoToDisplay.map(({ title, key, Icon }) => {
      if (!(key in user)) {
        return <Fragment key={key}></Fragment>;
      }
      return <div key={key} className='mb-4'>
        <div className={"grid grid-cols-2 gap-4 text-2xl text-[#070707] mb-4"}>
          <p>
            <Icon className='h-8 w-8 text-[#ccd3d7] inline me-2 sm:me-7'/>
            {title}
          </p>
          <p className={"font-bold"}>
            {user[key]}
          </p>
        </div>
        <hr />
      </div>;
    })}
  </div>;
}
