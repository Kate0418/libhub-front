import axios from "axios";
import Cookies from "js-cookie";

export async function Token(): Promise<{ success: boolean }> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/token`;
  const authToken = Cookies.get("authToken");

  return await axios
    .get(apiUrl, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
    .then((response) => response.data)
    .catch(() => ({ success: false }));
}
