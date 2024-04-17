import { useAuth } from "~/context/AuthProvider";
import AboutUsSection from "~/components/widgets/AboutUsSection";
import Loader from "~/components/UI/Loader";
import { useEffect, useState } from "react";
import { ClientActionFunctionArgs, useFetcher } from "@remix-run/react";
import { updateMeUserInfo } from "~/apis/userAPI";
import { IUserInfo, UserDegreeEnum } from "~/models/questionModel";

export const clientAction = async ({
                                     request
                                   }: ClientActionFunctionArgs) => {
  const formData = await request.formData();
  const errors: { [key: string]: string } = {};
  const degree = formData.get("degree");
  const study_field = formData.get("study_field");
  const university = formData.get("university");
  const graduation_year = formData.get("graduation_year");
  const userInfo: IUserInfo | null = JSON.parse(formData.get("user_info") as string ?? "{}");

  //Validation 
  if (!degree) {
    errors["degree"] = "Required";
  }
  if (!study_field) {
    errors["study_field"] = "Required";
  }
  if (!university) {
    errors["university"] = "Required";
  }
  if (!graduation_year) {
    errors["graduation_year"] = "Required";
  } else if (isNaN(+graduation_year)) {
    errors["graduation_year"] = "Invalid Graduation year";
  }
  if (!userInfo) {
    errors["general"] = "Invalid Info";
  }
  if (Object.keys(errors).length > 0) {
    return { errors, success: false };
  }

  if (degree === userInfo?.degree && +graduation_year! === userInfo?.graduation_year && study_field === userInfo?.study_field && university === userInfo?.university) {
    return { ...userInfo, success: false };
  }

  const res = await updateMeUserInfo({
    degree: degree as UserDegreeEnum,
    graduation_year: +graduation_year!,
    study_field: study_field as string,
    university: university as string
  });
  return {
    ...res,
    success: true
  };
};

export default function UserProfileAboutPage() {
  const { user, updateUserInfo } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const fetcher = useFetcher<typeof clientAction>();
  useEffect(() => {
    if (fetcher.data) {
      setEditMode(false);
      if (fetcher.data?.success) {
        updateUserInfo()
          .then(() => {

          });
      }
    }
  }, [fetcher.data]);

  if (!user) {
    return <div className="w-full h-full flex justify-center items-center">
      <Loader className="fill-[#5fc9a2] w-12 h-12" />
    </div>;
  }
  return <div>
    <fetcher.Form method="post" onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      formData.set("user_info", JSON.stringify(user?.user_info ?? {}));
      fetcher.submit(formData, { method: "post" });
    }}>
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
      }} editMode={editMode} />
    </fetcher.Form>
  </div>;

}
