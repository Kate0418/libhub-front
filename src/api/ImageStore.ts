import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";

export interface ImageStoreProps {
  image: {
    file: File | null;
    tags: string[];
  };
}

export interface ImageStoreResponse {
  success: boolean;
  messages: string[];
}

export async function ImageStore({
  image,
}: ImageStoreProps): Promise<ImageStoreResponse> {
  const api_url = `${process.env.NEXT_PUBLIC_API_URL}/image`;
  const token = Cookies.get("authToken");

  const formData = new FormData();
  if (image.file) {
    formData.append("image[file]", image.file);
  }

  return await axios
    .post<ImageStoreResponse>(
      api_url,
      {
        image: {
          ...image,
          file: formData.get("image[file]"),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error: AxiosError<ImageStoreResponse>) => {
      console.log(error);
      return {
        success: false,
        messages: error.response?.data.messages || ["エラーが発生しました"],
      };
    });
}
