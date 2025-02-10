import axios from "axios";

export interface AuthSignUpProps {
  email: string;
  password: string;
}

export interface AuthSignUpSuccessResponse {
  success: true;
  authToken: string;
}

export interface AuthSignUpErrorResponse {
  success: false;
  messages: string[];
}

export async function AuthSignUp({
  email,
  password,
}: AuthSignUpProps): Promise<
  AuthSignUpSuccessResponse | AuthSignUpErrorResponse
> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/sign-up`;

  return await axios
    .post<AuthSignUpSuccessResponse>(apiUrl, {
      email,
      password,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.warn(error);
      return {
        success: false,
        messages: error.response?.data.messages || ["エラーが発生しました"],
      };
    });
}
