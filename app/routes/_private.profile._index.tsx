import { useAuth } from "~/context/AuthProvider";
import AboutUsSection from "~/components/widgets/AboutUsSection";
import Loader from "~/components/UI/Loader";

export default function UserProfileAboutPage() {
  const { user } = useAuth();
  if (!user) {
    return <div className="w-full h-full flex justify-center items-center">
      <Loader className="fill-[#5fc9a2] w-12 h-12" />
    </div>;
  }
  return <div>
    <p className="font-bold text-4xl text-black mb-10">
      About
    </p>
    <AboutUsSection user={user} />
  </div>;

}