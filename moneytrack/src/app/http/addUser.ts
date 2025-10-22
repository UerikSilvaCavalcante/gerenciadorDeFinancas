"use server";
import { UserType } from "../types/userType";
export interface ResponseError {
  message: string;
}

export async function AddUser(
  newUser: UserType
): Promise<boolean | ResponseError> {
  const url = process.env.API_URL;
  const response = await fetch(`${url}/auth/add/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
    }),
  });
  if (response.ok) {
    return true;
  }
  return await response.json();
}
