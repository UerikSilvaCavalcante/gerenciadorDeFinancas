"use server";

import { ResponseProps } from "../types/IResponse";

export default async function getCode(email: string): Promise<ResponseProps> {
  const url = process.env.API_URL;

  const response = await fetch(`${url}/verification/`, {
    method: "POST",
    body: JSON.stringify({
      email: email,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    return {
      success: true,
      message: data.message,
    };
  }
  const data = await response.json();
  return {
    success: false,
    message: data.message,
  };
}
