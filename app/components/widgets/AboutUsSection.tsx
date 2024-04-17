import { IUser } from "~/models/questionModel";
import { Fragment, HTMLProps, JSX, ReactNode } from "react";
import UserIcon from "~/components/icons/UserIcon";
import EmailIcon from "~/components/icons/EmailIcon";
import EduHatIcon from "~/components/icons/EduHatIcon";
import UniBuildingIcon from "~/components/icons/UniBuildingIcon";
import CalenderIcon from "~/components/icons/CalenderIcon";
import StudyLevelIcon from "~/components/icons/StudyLevelIcon";
import clsx from "clsx";
import { DegreeDropDown } from "~/components/widgets/DegreeDropDown";


interface IProps {
  user: IUser;
  editMode?: boolean;
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


export default function AboutUsSection({ user, editMode }: IProps) {
  return <div>
    {InfoToDisplay.map(({ title, key, Icon }) => {
      if (!(key in user)) {
        return <Fragment key={key}></Fragment>;
      }
      return <div key={key}>
        <AboutUsItem Icon={Icon} title={title}>
          {user[key]}
        </AboutUsItem>
        <hr />
      </div>;
    })}
    <AboutUsItem Icon={EduHatIcon} title={"Education"}>
      {
        editMode ? <InputField name="study_field" id="study_field" /> : <EmptyFieldValue />
      }
    </AboutUsItem>
    <hr />
    <AboutUsItem Icon={StudyLevelIcon} title={"Study level"}>
      {
        editMode ? <DegreeDropDown /> : <EmptyFieldValue />
      }
    </AboutUsItem>
    <hr />
    <AboutUsItem Icon={UniBuildingIcon} title={"University/School"}>
      {
        editMode ? <InputField name="university" id="university" /> : <EmptyFieldValue />
      }
    </AboutUsItem>
    <hr />
    <AboutUsItem Icon={CalenderIcon} title={"Academic year"}>
      {
        editMode ? <InputField name="graduation_year" id="graduation_year" /> : <EmptyFieldValue />
      }
    </AboutUsItem>
  </div>;
}


function InputField(props: HTMLProps<HTMLInputElement>) {
  return <div className="flex items-center w-full h-full">
    <label htmlFor={props.id} className="sr-only">
      {props?.name ?? props?.label}
    </label>
    <input
      {...props}
      className={clsx("px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6", props.className)}
    />
  </div>;
}

function EmptyFieldValue() {
  return <div className="flex items-center w-full h-full">
    <div className="bg-[#ebf2f8] rounded max-h-3 max-w-32 w-full h-full"></div>
  </div>;
}

function AboutUsItem({ children, title, Icon }: { title: string, children: ReactNode, Icon: JSX.ElementType }) {
  return <div className={"my-4"}>
    <div className={"grid grid-cols-2 gap-4 text-2xl text-[#070707] mb-4"}>
      <p>
        <Icon className="h-8 w-8 text-[#ccd3d7] inline me-2 sm:me-7" />
        {title}
      </p>
      <div className={"font-bold"}>
        {children}
      </div>
    </div>
  </div>;
}
