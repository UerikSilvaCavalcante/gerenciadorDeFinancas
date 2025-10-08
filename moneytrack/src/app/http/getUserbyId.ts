import { ResponseUserType } from "../@types/userType";

export async function getUserById(id: number, token: string) {
    const response = await fetch(`http://127.0.0.1:8000/api/user/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data: ResponseUserType = await response.json();
    return data;
}