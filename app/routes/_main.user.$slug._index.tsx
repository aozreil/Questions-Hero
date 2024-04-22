import AboutUsSection from "~/components/widgets/AboutUsSection";
import { useOutletContext } from "@remix-run/react";
import { IUser } from "~/models/questionModel";


export default function UserProfileAboutPage() {
  const { user } = useOutletContext<{ user: IUser }>();
  
  return <div>
    <div className="flex justify-between">
      <p className="font-bold text-4xl text-black mb-10">
        About
      </p>
    </div>
    <AboutUsSection user={user} />
  </div>;

}
