"use client";

import { Token } from "@/api/Token";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Main({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const pathname = usePathname();
  const exclusionRoutes = ["/login", "/sign-up", "/"];

  const checkToken = async () => {
    const token = await Token();
    if (!token.success) {
      router.push("/login");
    }
  };

  useEffect(() => {
    if (exclusionRoutes.includes(pathname)) return;

    checkToken();
    const intervalId = setInterval(checkToken, 60000);

    return () => clearInterval(intervalId);
  }, [pathname]);

  return <main>{children}</main>;
}
