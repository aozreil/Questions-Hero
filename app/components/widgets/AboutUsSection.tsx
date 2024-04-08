import { IUser } from "~/models/questionModel";
import { Fragment } from "react";


interface IProps {
  user: IUser;
}


const InfoToDisplay = [{ title: "Name", key: "view_name" }, { title: "Email Address", key: "email" }];
export default function AboutUsSection({ user }: IProps) {
  return <div>
    <p className="font-bold text-4xl text-black mb-10">
      About
    </p>
    {InfoToDisplay.map(({ title, key }) => {
      if (!(key in user)) {
        return <Fragment key={key}></Fragment>;
      }
      return <div key={key}>
        <div className={"grid grid-cols-2 gap-4 text-2xl text-[#070707] mb-4"}>
          <p>
            {title}
          </p>
          <p className={"font-bold"}>
            {user[key]}
          </p>

        </div>
        <hr />
      </div>;

    })}
  </div>
    ;
}