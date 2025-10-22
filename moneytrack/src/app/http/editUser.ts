"use server";
import { ResponseUserType, UserType } from "../../@types/userType";
interface ResponseError {
  message: string;
}

export default async function editUser(
  user: UserType,
  token: string
): Promise<ResponseUserType | ResponseError> {
  const url = process.env.API_URL;

  const response = await fetch(`${url}/user/${user.id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: user.name,
      username: user.username,
      email: user.email,
    }),
  });
  if (response.ok) {
    return (await response.json()) as ResponseUserType;
  }
  return (await response.json()) as ResponseError;
}
