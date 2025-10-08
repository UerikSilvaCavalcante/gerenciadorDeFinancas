interface ResponseProps {
  access_token: string;
  token_type: string;
}

import { LoginType } from "../@types/userType";
export async function getlogin({
  username,
  password,
}: LoginType): Promise<ResponseProps> {
  const response = await fetch("http://127.0.0.1:8000/api/auth/", {
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
  const data = await response.json();
  return {
    access_token: "",
    token_type: "",
  };
}
