"use server";
import { ResponseProps } from "../types/IResponse";
interface tokenProps extends ResponseProps {
  access_token: string;
  token_type: string;
}

import { LoginType } from "../types/userType";
export async function getlogin({
  username,
  password,
}: LoginType): Promise<tokenProps> {
  const url = process.env.API_URL!;
  try {
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
    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: "Login efetuado com sucesso",
        access_token: data.access_token,
        token_type: data.token_type,
      };
    }
    return {
      success: false,
      message: data.message,
      access_token: data.access_token,
      token_type: data.token_type,
    };
  } catch (error) {
    throw new Error("Erro no servidor");
  }
}
