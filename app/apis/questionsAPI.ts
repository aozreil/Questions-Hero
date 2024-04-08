import axios from "axios";
import { IAnswer, IQuestion, IUser } from "~/models/questionModel";
import { ASKGRAM_BASE } from "~/config/enviromenet";

export async function clientGetAnswer (id: string) {
  const response = await axios.get<IAnswer[]>(`${ASKGRAM_BASE}/api/content/answers/question/${id}`);
  return response?.data;
}

export async function clientGetUsers (ids: number[]) {
  const response = await axios.get<IUser[]>(`${ASKGRAM_BASE}/api/users/users/public?ids=${ids?.join()}`);
  return response?.data;
}

export async function getMyAskedQuestions() {
  const response = await axios.get<IQuestion[]>(`${ASKGRAM_BASE}/api/content/me/questions`);
  return response?.data;
}

export async function getMyAnswersForQuestions() {
  const response = await axios.get<IAnswer[]>(`${ASKGRAM_BASE}/api/content/me/answers`);
  return response?.data;
}