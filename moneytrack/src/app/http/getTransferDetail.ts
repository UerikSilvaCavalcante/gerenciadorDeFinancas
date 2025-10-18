
import { RespnseTransferType } from "../@types/transferType";

export async function getTransferDetail(id: number, token:string): Promise<RespnseTransferType | null> {
    const response = await fetch(`http://127.0.0.1:8000/api/transfer/detail/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        
    });

    if (response.ok) {
        const data: RespnseTransferType = await response.json();
        return data;
    }
    return null
}