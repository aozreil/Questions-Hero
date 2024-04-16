import { IUser } from "~/models/questionModel";
import { ComponentType, Fragment, JSX, ReactNode } from "react";
import UserIcon from "~/components/icons/UserIcon";
import EmailIcon from "~/components/icons/EmailIcon";
import EduHatIcon from "~/components/icons/EduHatIcon";
import UniBuildingIcon from "~/components/icons/UniBuildingIcon";
import CalenderIcon from "~/components/icons/CalenderIcon";
import StudyLevelIcon from "~/components/icons/StudyLevelIcon";


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
      return <div key={key}>
        <AboutUsItem Icon={Icon} title={title} value={user[key]} />
        <hr />
      </div>;
    })}
    <AboutUsItem Icon={EduHatIcon} title={"Education"} value={""} />
    <hr />
    <AboutUsItem Icon={StudyLevelIcon} title={"Study level"} value={""} />
    <hr />
    <AboutUsItem Icon={UniBuildingIcon} title={"University/School"} value={""} />
    <hr />
    <AboutUsItem Icon={CalenderIcon} title={"Academic year"} value={""} />
  </div>;
}

function AboutUsItem({value, title, Icon}: {title: string, value: string,Icon: JSX.ElementType  }) {
  return <div className={'my-4'}>
    <div className={"grid grid-cols-2 gap-4 text-2xl text-[#070707] mb-4"}>
      <p>
        <Icon className='h-8 w-8 text-[#ccd3d7] inline me-2 sm:me-7' />
        {title}
      </p>
      <p className={"font-bold"}>
        {value}
      </p>
    </div>
  </div>
}
