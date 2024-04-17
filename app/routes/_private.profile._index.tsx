import { useAuth } from "~/context/AuthProvider";
import AboutUsSection from "~/components/widgets/AboutUsSection";
import Loader from "~/components/UI/Loader";
import { useEffect, useRef, useState } from "react";
import { ClientActionFunctionArgs, useFetcher } from "@remix-run/react";
import { updateMeUserInfo } from "~/apis/userAPI";
import { UserDegreeEnum } from "~/models/questionModel";

export const clientAction = async ({
                                     request
                                   }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  return await updateMeUserInfo({
    degree: values["degree"] as UserDegreeEnum,
    graduation_year: +values["graduation_year"],
    study_field: values["study_field"] as string,
    university: values["university"] as string
  });
};

export default function UserProfileAboutPage() {
  const { user, updateUserInfo } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const fetcher = useFetcher();
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (fetcher.data) {
      setEditMode(false);
      updateUserInfo()
        .then(() => {

        });
    }
  }, [fetcher.data]);

  if (!user) {
    return <div className="w-full h-full flex justify-center items-center">
      <Loader className="fill-[#5fc9a2] w-12 h-12" />
    </div>;
  }
  return <div>
    <fetcher.Form method="post">
      <div className="flex justify-between">
        <p className="font-bold text-4xl text-black mb-10">
          About
        </p>
        <button
          disabled={fetcher.state === "loading" || fetcher.state === "submitting"}
          className={"text-[#163bf3] hover:bg-gray-100 rounded px-4 h-fit py-2 text-lg"} onClick={(e) => {
          if (!editMode) {
            e.preventDefault();
            setEditMode(true);
          }
        }}>
          {editMode ? fetcher.state === "submitting" ? "Saving..." : "Save" : "Edit Info"}
        </button>
      </div>


      <AboutUsSection user={{
        ...user, user_info: {
          ...user.user_info,
          ...(fetcher.data ?? {})
        }
      }}
                      editMode={editMode} />
    </fetcher.Form>
  </div>;

}
