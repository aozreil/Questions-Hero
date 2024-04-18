import { useAuth } from "~/context/AuthProvider";
import AboutUsSection from "~/components/widgets/AboutUsSection";
import Loader from "~/components/UI/Loader";
import { useEffect, useState } from "react";
import { ClientActionFunctionArgs, useFetcher } from "@remix-run/react";
import { updateMeUserInfo } from "~/apis/userAPI";
import { IUserInfo, UserDegreeEnum } from "~/models/questionModel";
import { AxiosError } from "axios";

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

  try {
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
  } catch (e) {
    if (e instanceof AxiosError) {
      errors["general"] = e.response?.data?.message ?? "Invalid User Inputs";
    } else {
      console.error(e);
      errors["general"] = "Something When wrong! Please try again";
    }
    return {
      success: false,
      errors
    };
  }
};

export default function UserProfileAboutPage() {
  const { user, updateUserInfo } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const fetcher = useFetcher<typeof clientAction>();
  useEffect(() => {
    if (fetcher.data) {
      if (fetcher.data?.success) {
        setEditMode(false);
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

      {fetcher?.data?.errors?.general && <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                 className="h-5 w-5 text-red-400" aria-hidden="true">
              <path fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd" />
            </svg>

          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-red-800">{fetcher?.data?.errors?.general}</p>
          </div>
        </div>
      </div>}


      <AboutUsSection user={{
        ...user, user_info: {
          ...user.user_info,
          ...(fetcher.state !== "idle" ? fetcher.data ?? {} : {})
        }
      }} editMode={editMode} />
    </fetcher.Form>
  </div>;

}
