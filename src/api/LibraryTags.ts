import { SelectItem } from "@/components/Select";
import axios from "axios";
import Cookies from "js-cookie";

export interface LibraryTagsResponse {
  success: boolean;
  tags: SelectItem[];
}

export async function LibraryTags(): Promise<LibraryTagsResponse> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/library/tags`;
  const authToken = Cookies.get("authToken");

  try {
    const response = await axios.get<LibraryTagsResponse>(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (e) {
    console.warn(e);
    return {
      success: false,
      tags: [],
    };
  }
}
