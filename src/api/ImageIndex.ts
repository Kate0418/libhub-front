import axios from "axios";

export interface ImageIndexProps {
  loadingCount: number;
  searchTags: string[];
}

export interface ImageIndexResponse {
  success: boolean;
  images: Array<{
    id: number;
    url: string;
    tags: string[];
  }>;
}

export async function ImageIndex({
  loadingCount,
  searchTags,
}: ImageIndexProps): Promise<ImageIndexResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/image`;

  return await axios
    .get<ImageIndexResponse>(apiUrl, {
      params: {
        loadingCount,
        searchTags: searchTags,
      },
    })
    .then((response) => response.data);
}
