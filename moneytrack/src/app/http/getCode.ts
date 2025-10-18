interface ResponseProps {
    success: boolean
    message: string
}
export default async function getCode(email:string):Promise<ResponseProps> {
    const response = await fetch(`http://127.0.0.1:8000/api/verification/`, {
        method: "POST",
        body: JSON.stringify({
            email: email,
        }),
    })
    if (response.ok) {
        const data = await response.json();
        return  {
            success: true,
            message: data.message
        }
    }    
    const data = await response.json();
    return {
        success: false,
        message: data.message
    }
}
