"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Cookies from "js-cookie";
import { AuthSignUp } from "@/api/AuthSignUp";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const router = useRouter();
  const signUpApi = async () => {
    if (password !== passwordConfirmation) {
      alert("パスワードが一致しません");
      return;
    }
    const response = await AuthSignUp({ email, password });
    if (response.success) {
      Cookies.set("authToken", response.authToken);
      router.push("/");
    } else {
      alert(response.messages[0]);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-100px)] gap-8">
      <Image src="/logo.png" alt="logo" width={400} height={400} />

      <div className="w-[600px] flex flex-col gap-4">
        <div>
          <label>メールアドレス</label>
          <input
            className="p-3 rounded-lg w-full text-black"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            className="p-3 rounded-lg w-full text-black"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label>パスワード（確認）</label>
          <input
            className="p-3 rounded-lg w-full text-black"
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button
          className="bg-white text-black font-bold px-8 py-2 rounded-lg mt-8 ring-white hover:bg-black hover:ring-2 hover:text-white transition duration-700"
          onClick={() => signUpApi()}
        >
          サインアップ
        </button>
        <Link
          className="bg-white text-black font-bold px-8 py-2 rounded-lg mt-8 ring-white hover:bg-black hover:ring-2 hover:text-white transition duration-700"
          href="/login"
        >
          ログイン済みの方はこちら
        </Link>
      </div>
    </div>
  );
}
