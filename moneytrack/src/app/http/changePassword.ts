"use server";
import { ResponseProps } from "../../@types/IResponse";
export default async function changePassword(
  email: string,
  password: string
): Promise<ResponseProps> {
  const url = process.env.API_URL;
  const response = await fetch(`${url}/verification/password/`, {
    method: "POST",

    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    return {
      success: true,
      message: data.message,
    };
  }

  throw new Error(data.message);
}
