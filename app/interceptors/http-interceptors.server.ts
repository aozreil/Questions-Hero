import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import { isbot } from "isbot";
import {getCookie} from "~/services/cookie.service";
import { BASE_URL } from "~/config/enviromenet";
import { VERSION_DATE } from "~/config/enviroment.server";
import qs from "qs";

const Axios = axios.create({
  baseURL: BASE_URL,
});

export interface RequestConfigCustomize extends AxiosRequestConfig {
  req?: Request;
}

export default class AxiosServerInstance {
  static get<T>(url: string, config?: RequestConfigCustomize) {
    return Axios.get<T>(url, prepareConfig(config));
  }

  static post<T>(url: string, payload?: unknown, config?: RequestConfigCustomize) {
    return Axios.post<T>(url, payload, prepareConfig(config));
  }

  static put<T>(url: string, payload?: unknown, config?: RequestConfigCustomize) {
    return Axios.put<T>(url, payload, prepareConfig(config));
  }

  static delete<T>(url: string, config?: RequestConfigCustomize) {
    return Axios.delete<T>(url, prepareConfig(config));
  }
}

function prepareConfig(config?: RequestConfigCustomize) {
  const cookie = config?.req?.headers.get("Cookie");
  const bot = isbot(config?.req?.headers.get("User-Agent") ?? "");

  if (config && cookie && config.req) {
    const header = {
      cookie: cookie,
      Authorization: `Bearer ${getCookie("token", config.req)}`
    };

    config = {
      ...config,
      headers: {
        ...header,
      },
    };
  }

  return {
    ...config,
    headers: {
      ...config?.headers,
      'web-version':VERSION_DATE,
      "User-Agent": `AskgramServer - ${config?.req?.headers.get("User-Agent")?? ''}` ,
    },
    params: {
      ...config?.params,
      is_bot: bot? bot.toString(): undefined,
    },
  };
}

export function paramsSerializerComma(params: any) {
  return qs.stringify(params, { arrayFormat: 'comma' })
}