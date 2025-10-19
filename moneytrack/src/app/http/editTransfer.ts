import { ResponseProps } from "../@types/IResponse";
import { TransferType } from "../@types/transferType";

export default async function editTransfer(id:number, token:string, transfer:TransferType):Promise<ResponseProps> {
    const response = await fetch(`http://127.0.0.1:8000/api/transfer/${id}`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user_id_id: transfer.user_id,
            value: transfer.value,
            date: transfer.date,
            description: transfer.description,
            type_transfer: transfer.type_transfer,
            payment_method: transfer.payment_method,
            card_id_id: transfer.card_id,
        }),
    })
    const data = await response.json();
    if (response.ok){
        return {
            success: true,
            message: "Transferência alterada com sucesso"
        }
    }
    throw new Error(data.message)
}