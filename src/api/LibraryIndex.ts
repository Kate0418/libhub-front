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
  const api_url = `${process.env.NEXT_PUBLIC_API_URL}/library`;
  const token = Cookies.get("authToken");

  return await axios
    .get<LibraryIndexResponse>(api_url, {
      params: {
        loadingCount,
        searchTags: searchTags,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
    .then((response) => response.data);
}
