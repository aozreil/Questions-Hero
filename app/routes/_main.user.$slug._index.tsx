import AboutUsSection from "~/components/widgets/AboutUsSection";
import { useOutletContext } from "@remix-run/react";
import { IUser } from "~/models/questionModel";
import { MetaFunction } from "@remix-run/node";
import { getSeoMeta } from "~/utils/seo";
import { clientLoader } from "~/routes/_main.user.$slug.questions";


export const meta: MetaFunction<typeof clientLoader> = ({ location, matches }) => {
  const match = matches.find(el => el.id === "routes/_main.user.$slug");
  let title = "Not found";
  if (match && match?.data && "user" in match.data) {
    const user = match.data?.user as IUser;
    if (user) {
      title = user.view_name + " Profile";
    }
  }
  return [
    ...getSeoMeta({
      title: title,
      canonical: location.pathname
    })
  ];
};

export default function UserProfileAboutPage() {
  const { user } = useOutletContext<{ user: IUser }>();
  
  return <div>
    <div className="flex justify-between">
      <p className="max-md:hidden font-bold text-3xl text-black mb-10">
        About
      </p>
    </div>
    <AboutUsSection user={user} />
  </div>;

}
