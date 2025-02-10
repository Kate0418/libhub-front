import axios, { AxiosError } from "axios";

export interface AuthLoginProps {
  email: string;
  password: string;
}
export interface AuthLoginSuccessResponse {
  success: true;
  authToken: string;
}

export interface AuthLoginErrorResponse {
  success: false;
  messages: string[];
}

export async function AuthLogin({
  email, password,
}: AuthLoginProps): Promise<AuthLoginSuccessResponse | AuthLoginErrorResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/login`;

  return await axios
    .post<AuthLoginSuccessResponse | AuthLoginErrorResponse>(
      apiUrl,
      {
        email: email,
        password: password,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError<AuthLoginErrorResponse>) => {
      console.warn(error);
      return {
        success: false,
        messages: error.response?.data.messages || ["エラーが発生しました"],
      };
    });
}
