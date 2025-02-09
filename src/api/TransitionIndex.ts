import axios from "axios";

export interface TransitionIndexProps {
  imageId: number;
}

export interface TransitionIndexResponse {
  success: boolean;
  images: Array<{
    id: number;
    url: string;
    tags: string[];
  }>;
}

export async function TransitionIndex({
  imageId,
}: TransitionIndexProps): Promise<TransitionIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/transition`;

  return await axios
    .get(apiUrl, {
      params: {
        imageId: imageId,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.warn(error);
      return {
        success: false,
        images: [],
      };
    });
}
