import { ResponseProps } from "../@types/IResponse";

export default async function DeleteCard(id:number, token:string):Promise<ResponseProps> {
    const response = await fetch(`http://127.0.0.1:8000/api/card/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    
    const data = await response.json();
    if (response.ok){
        return {
            success: true,
            message: data.message
        }
    }
    throw new Error(data.message)
}

