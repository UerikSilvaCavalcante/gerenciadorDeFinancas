import { GraphType } from "../@types/graphType";

export async function getGrauphType(id:number, token:string) {
    const response = await fetch(`http://127.0.0.1:8000/api/dashboard/plts/gastos/${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    const data: GraphType = await response.json();
    return data;
}

