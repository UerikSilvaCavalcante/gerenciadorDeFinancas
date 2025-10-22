"use server";

interface ResponseProps {
  access_token: string;
  token_type: string;
}

import { LoginType } from "../../types/userType";
export async function getlogin({
  username,
  password,
}: LoginType): Promise<ResponseProps> {
  const url = process.env.API_URL!;
  const response = await fetch(`${url}/auth/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    return {
      access_token: data.access_token,
      token_type: data.token_type,
    };
  }

  return {
    access_token: "",
    token_type: "",
  };
}
