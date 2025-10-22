"use server";
import { ResponseProps } from "../../types/IResponse";

export default async function deleteUser(
  id: number,
  token: string
): Promise<ResponseProps> {
  const url = process.env.API_URL;

  const response = await fetch(`${url}/user/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    return {
      success: true,
      message: "Usuário deletado com sucesso",
    };
  }
  throw new Error(data.message);
}
