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
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/image`;
  const authToken = Cookies.get("authToken");

  const formData = new FormData();
  if (image.file) {
    formData.append("image[file]", image.file);
  }

  return await axios
    .post<ImageStoreResponse>(
      apiUrl,
      {
        image: {
          ...image,
          file: formData.get("image[file]"),
        },
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
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
