import { useAuth } from "~/context/AuthProvider";
import AboutUsSection from "~/components/widgets/AboutUsSection";

export default function UserProfileAboutPage() {
  const { user } = useAuth();
  if (!user) {
    return <div>Loading...</div>;
  }
  return <AboutUsSection user={user} />;

}