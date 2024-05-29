import axios, { AxiosRequestConfig } from "axios";
import { ASKGRAM_BASE } from "~/config/enviromenet";
import { axiosApiInstance } from "~/interceptors/client-interceptors";
import { IMeUser, IUser, IUserInfo } from "~/models/questionModel";

export async function loginWithGoogle(jwt_token: string) {
  const res = await axios.post<IMeUser>(
    `${ASKGRAM_BASE}/api/users/login/google`,
    {
      id_token: jwt_token
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );
  return res.data;
}

export async function getMe(config?: AxiosRequestConfig) {
  const res = await axiosApiInstance.get<IMeUser>(
    `${ASKGRAM_BASE}/api/users/me`,
    {
      ...config,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );
  return res.data;
}


export async function updateMeUserInfo(body: IUserInfo, config?: AxiosRequestConfig) {
  const res = await axiosApiInstance.put<IUserInfo>(
    `${ASKGRAM_BASE}/api/users/me/user-info`,
    body,
    {
      ...config,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );
  return res.data;
}

export async function getPublicUserProfile(id: number, config?: AxiosRequestConfig) {
  const res = await axiosApiInstance.get<IUser>(`${ASKGRAM_BASE}/api/users/users/${id}/profile`, {
    ...config,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  });
  return res.data
}

export async function refreshToken() {
  const res = await axios.post(
    `${ASKGRAM_BASE}/api/users/token/refresh`,
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );
  return res.data;
}

export async function logoutAPI() {
  const res = await axios.post(
    `${ASKGRAM_BASE}/api/users/log-out`,
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    }
  );
  return res.data;
}
