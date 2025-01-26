import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export interface LibraryStoreProps {
  image: {
    id: number;
    tags: string[];
  };
}

export interface LibraryStoreResponse {
  success: boolean;
  messages: string[];
}

export async function LibraryStore({
  image,
}: LibraryStoreProps): Promise<LibraryStoreResponse> {
  const api_url = `${process.env.NEXT_PUBLIC_API_URL}/library`;
  const token = Cookies.get("authToken");

  return await axios
    .post<LibraryStoreResponse>(
      api_url,
      {
        image: image,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError<LibraryStoreResponse>) => {
      console.log(error);
      return {
        success: false,
        messages: error.response?.data.messages || ["エラーが発生しました"],
      };
    });
}
