import { SelectItem } from "@/components/Select";
import axios from "axios";

export interface TagSelectResponse {
  success: boolean;
  tags: SelectItem[];
}

export async function TagSelect(): Promise<TagSelectResponse> {
  const api_url = `${process.env.NEXT_PUBLIC_API_URL}/tag/select`;

  try {
    const response = await axios.get<TagSelectResponse>(api_url);
    return response.data;
  } catch (e) {
    console.warn(e);
    return {
      success: false,
      tags: [],
    };
  }
}
