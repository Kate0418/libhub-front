import axios from "axios";
import Cookies from "js-cookie";

export interface LibraryIndexProps {
  loadingCount: number;
  searchTags: string[];
}

export interface LibraryIndexResponse {
  success: boolean;
  images: Array<{
    id: number;
    url: string;
    tags: string[];
  }>;
}

export async function LibraryIndex({
  loadingCount,
  searchTags,
}: LibraryIndexProps): Promise<LibraryIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/library`;
  const authToken = Cookies.get("authToken");

  return await axios
    .get<LibraryIndexResponse>(apiUrl, {
      params: {
        loadingCount,
        searchTags: searchTags,
      },
      headers: {
        Authorization: `Bearer ${authToken}`,
      }
    })
    .then((response) => response.data)
    .catch((error) => {
      console.warn(error);
      return {
        success: false,
        images: [],
      };
    });
}
