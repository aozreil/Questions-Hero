import { useAuth } from "~/context/AuthProvider";
import AboutUsSection from "~/components/widgets/AboutUsSection";
import Loader from "~/components/UI/Loader";
import { useState } from "react";
import { ClientActionFunctionArgs, useFetcher } from "@remix-run/react";
import { updateMeUserInfo } from "~/apis/userAPI";

export const clientAction = async ({
                                     request
                                   }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const values = Object.fromEntries(formData);
  return await updateMeUserInfo(values as any);
};

export default function UserProfileAboutPage() {
  const { user } = useAuth();
  // const actionData = useActionData<typeof clientAction>()
  const [editMode, setEditMode] = useState(false);
  const fetcher = useFetcher();

  if (!user) {
    return <div className="w-full h-full flex justify-center items-center">
      <Loader className="fill-[#5fc9a2] w-12 h-12" />
    </div>;
  }
  return <div>
    <div className="flex justify-between">
      <p className="font-bold text-4xl text-black mb-10">
        About
      </p>
      <button className={"text-[#163bf3] hover:bg-gray-100 rounded px-4 h-fit py-2 text-lg"} onClick={() => {
        if (editMode) {
          setEditMode(false);
        } else {
          setEditMode(true);
        }
      }}>
        {editMode ? "Save" : "Edit Info"}
      </button>
    </div>

    <fetcher.Form method="post">
      <AboutUsSection user={user} editMode={editMode} />
      <button type={"submit"}>submit</button>
    </fetcher.Form>

  </div>;

}
