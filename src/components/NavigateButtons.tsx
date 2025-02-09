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

  const linkClassName = "border-8 border-black flex items-center justify-center h-20 rounded-full bg-white hover:ring-2 hover:ing-offset-8 ring-white transition duration-700"
  return (
    <div className="flex gap-4">
      <Link
        href={isLibraryPage ? "/" : "/library"}
        className={`w-56 text-black font-bold ${linkClassName}`}
      >
        {isLibraryPage ? "トップページ" : "マイライブラリ"}
      </Link>
      <Link
        href={authToken ? "/store" : "/login"}
        className={`w-20 ${linkClassName}`}
      >
        <AddIcon />
      </Link>
    </div>
  );
}
