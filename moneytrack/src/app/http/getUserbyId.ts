"use server";
import { ResponseUserType } from "../types/userType";

export async function getUserById(id: number, token: string) {
  const url = process.env.API_URL;

  const response = await fetch(`${url}/user/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data: ResponseUserType = await response.json();
  return data;
}
