interface ResponseProps {
  success: boolean;
  message: string;
}

export default async function changePassword(
  email: string,
  password: string,
): Promise<ResponseProps> {
  const response = await fetch(`http://127.0.0.1:8000/api/verification/password/`, {
    method: "POST",
    
    body: JSON.stringify({
      email: email,
      password: password,
    }),
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
