interface ResponseDelete {
    success: boolean
    message: string
}

export default async function DeleteTransfer(id: number, token: string): Promise<ResponseDelete> {
  const response = await fetch(`http://127.0.0.1:8000/api/transfer/${id}/`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await response.json();
  if (response.ok) {
    return {
      success: true,
      message: data.message,
    };
  }
  return {
    success: false,
    message: data.message,
  };
}
