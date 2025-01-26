import Link from "next/link";
import { AddIcon } from "./icons/AddIcon";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function NavigateButtons() {
  const [authToken, setAuthToken] = useState(false);
  useEffect(() => {
    setAuthToken(!!Cookies.get("authToken"));
  });

  const isLibraryPage = usePathname().startsWith("/library");

  return (
    <div className="flex gap-4">
      <Link
        href={isLibraryPage ? "/" : "/library"}
        className="flex items-center justify-center w-48 h-18 px-3 rounded-full bg-white text-black font-bold"
      >
        {isLibraryPage ? "トップページ" : "マイライブラリ"}
      </Link>
      <Link
        href={authToken ? "/store" : "/login"}
        className="flex items-center justify-center w-16 h-16 rounded-full bg-white hover:ring-2 hover:ing-offset-8 ring-white transition duration-700"
      >
        <AddIcon />
      </Link>
    </div>
  );
}
