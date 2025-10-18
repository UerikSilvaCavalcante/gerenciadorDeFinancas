interface ResponseProps {
    message: string
}

export default async function deleteUser(id:number, token:string):Promise<ResponseProps> {
    const response = await fetch(`http://127.0.0.1:8000/api/user/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    const data = await response.json();
    return data

}

