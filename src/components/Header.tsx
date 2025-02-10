"use client";

import { TagSelect } from "@/api/TagSelect";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@/components/Select";
import { usePathname, useRouter } from "next/navigation";
import { useSearchTags } from "@/SearchTagsProvider";
import { LibraryTags } from "@/api/LibraryTags";

export function Header() {
  const router = useRouter();
  const isLibraryPage = usePathname().startsWith("/library");
  const { searchTags, setSearchTags } = useSearchTags();

  const [allTags, setAllTags] = useState<SelectItem[]>([]);
  useEffect(() => {
    const selectApi = async () => {
      const response = isLibraryPage ? await LibraryTags() : await TagSelect();
      setAllTags(response.tags);
    };
    selectApi();
  }, []);

  return (
    <div>
      <div className="h-16 pl-3 flex items-center gap-8 fixed top-0 left-0 z-20">
        <Image
          src="/logo.png"
          alt="logo"
          width={200}
          height={200}
          onClick={() => router.push("/")}
        />

        <div className="border-2 border-white w-[800px] rounded-lg px-2 bg-black">
          <Select
            options={allTags}
            placeholder="検索"
            onChange={(e: SelectItem[]) => {
              setSearchTags(e.map((item) => item.value));
              if (!isLibraryPage) {
                router.push("/");
              }
            }}
            isMulti={true}
            value={allTags.filter((item) => searchTags.includes(item.value))}
          />
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
