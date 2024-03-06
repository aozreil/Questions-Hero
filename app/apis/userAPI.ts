import axios from "axios";
import { ASKGRAM_BASE } from "~/config/enviromenet";
import { axiosApiInstance } from "~/interceptors/client-interceptors";
import { IUser } from "~/models/questionModel";

export async function loginWithGoogle(jwt_token: string) {
  const res = await axios.post<IUser>(
    `${ASKGRAM_BASE}/api/users/login/google`,
    {
      id_token: jwt_token,
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  return res.data;
}

export async function getMe() {
  const res = await axiosApiInstance.get<IUser>(
    `${ASKGRAM_BASE}/api/users/users/me`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
  );
  return res.data;
}

export async function refreshToken() {
  const res = await axios.post(
    `${ASKGRAM_BASE}/api/users/token/refresh`,
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    },
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
        Accept: "application/json",
      },
    },
  );
  return res.data;
}