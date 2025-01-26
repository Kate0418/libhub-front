import Link from "next/link";
import { AddIcon } from "./icons/AddIcon";

export function NavigateButtons() {
  return (
    <Link href="/store" className="flex items-center justify-center w-16 h-16 rounded-full bg-white hover:ring-2 hover:ing-offset-8 ring-white transition duration-700">
        <AddIcon />
    </Link>
  );
}
