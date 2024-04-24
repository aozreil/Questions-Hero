import { IMeUser, IUser, IUserInfo } from "~/models/questionModel";
import { HTMLProps, JSX, ReactNode } from "react";
import UserIcon from "~/components/icons/UserIcon";
import EmailIcon from "~/components/icons/EmailIcon";
import EduHatIcon from "~/components/icons/EduHatIcon";
import UniBuildingIcon from "~/components/icons/UniBuildingIcon";
import CalenderIcon from "~/components/icons/CalenderIcon";
import StudyLevelIcon from "~/components/icons/StudyLevelIcon";
import clsx from "clsx";
import { DegreeDropDown, degreeEnumMapper } from "~/components/widgets/DegreeDropDown";
import { formatDate } from "date-fns";


interface IProps {
  user: IMeUser | IUser;
  editMode?: boolean;
  errors?: { [key in keyof IUserInfo]?: string };
}

export default function AboutUsSection({ user, editMode, errors }: IProps) {
  return <div data-cy={'AboutUsSection'}>
    <AboutUsItem Icon={UserIcon} title={"Name"}>
      <div className={"lg:flex justify-between lg:items-center"}>
        <p className="overflow-hidden text-ellipsis"> {user.view_name}</p>
        {"created_at" in user && <p className="text-[#99a7af] font-normal text-sm"> Joined
          on <strong>{formatDate(user.created_at, "MMMM dd, yyyy")}</strong></p>
        }
      </div>
    </AboutUsItem>
    <hr />
    {"email" in user && <><AboutUsItem Icon={EmailIcon} title={"Email"}>
      <p className="overflow-hidden text-ellipsis">{user.email}</p>
    </AboutUsItem>
      <hr />
    </>
    }
    <AboutUsItem Icon={UniBuildingIcon} title={"University"}>
      {
        editMode ?
          <InputField name="university" id="university" required defaultValue={user.user_info?.university}
                      maxLength={100} error={errors?.university} /> :
          user.user_info?.university ? <p className="overflow-hidden text-ellipsis">{user.user_info?.university}</p> :
            <EmptyFieldValue />
      }
    </AboutUsItem>
    <hr />
    <AboutUsItem Icon={StudyLevelIcon} title={"Degree"}>
      {
        editMode ? <DegreeDropDown defaultValue={user.user_info?.degree} /> :
          user.user_info?.degree ?
            <p className="overflow-hidden text-ellipsis">{degreeEnumMapper(user.user_info.degree)}</p> :
            <EmptyFieldValue />
      }
    </AboutUsItem>
    <hr />
    <AboutUsItem Icon={EduHatIcon} title={"Major"}>
      {
        editMode ?
          <InputField name="study_field" id="study_field" required defaultValue={user.user_info?.study_field}
                      maxLength={100} error={errors?.study_field} /> :
          user.user_info?.study_field ? <p className="overflow-hidden text-ellipsis">{user.user_info.study_field}</p> :
            <EmptyFieldValue />
      }
    </AboutUsItem>
    <hr />
    <AboutUsItem Icon={CalenderIcon} title={"Graduation year"}>
      {
        editMode ?
          <InputField name="graduation_year" id="graduation_year" required type="number" min={1900} max={2100}
                      defaultValue={user.user_info?.graduation_year} maxLength={100}
                      error={errors?.graduation_year} /> :
          user.user_info?.graduation_year ?
            <p className="overflow-hidden text-ellipsis">{user.user_info.graduation_year}</p> :
            <EmptyFieldValue />
      }
    </AboutUsItem>
  </div>;
}


interface IPropsInputField extends HTMLProps<HTMLInputElement> {
  error?: string;
}

function InputField({ error, ...props }: IPropsInputField) {
  return <div className="flex items-center w-full h-full" data-cy={'InputField'}>
    <label htmlFor={props.id} className="sr-only">
      {props?.name ?? props?.label}
    </label>
    <div className="relative w-full">
      <input
        {...props}
        className={clsx(
          "px-4 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
          props.className,
          {
            "ring-red-300": error
          }
        )}
      />
      {error && <p className="ms-2 text-sm text-red-600" id="email-error">
        {error}
      </p>}
    </div>

  </div>;
}

function EmptyFieldValue() {
  return <div className="flex items-center w-full h-full">
    <div className="bg-[#ebf2f8] rounded max-h-3 max-w-32 w-full h-full"></div>
  </div>;
}

function AboutUsItem({ children, title, Icon }: { title: string, children: ReactNode, Icon: JSX.ElementType }) {
  return <div className={"my-4"} data-cy={'AboutUsItem'}>
    <div className={"grid grid-cols-2 gap-4 text-xl md:text-2xl text-[#070707] mb-4"}>
      <p className="overflow-hidden text-ellipsis line-clamp-1">
        <Icon className="h-8 w-8 text-[#ccd3d7] inline me-2 sm:me-7" />
        {title}
      </p>
      <div className={"font-bold"}>
        {children}
      </div>
    </div>
  </div>;
}
