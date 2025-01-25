"use client";

import { TagSelect } from "@/api/TagSelect";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Select, SelectItem } from "@/components/Select";
import { useRouter } from "next/navigation";
import { useSelectTags } from "@/SelectTagsProvider";

export function Header() {
  const router = useRouter();
  const { selectTags, setSelectTags } = useSelectTags();

  const [allTags, setAllTags] = useState<SelectItem[]>([]);
  useEffect(() => {
    const selectApi = async () => {
      const response = await TagSelect();
      setAllTags(response.tags);
    };

    selectApi();
  }, []);

  return (
    <div>
      <div className="h-16 pl-3 flex items-center gap-8 fixed top-0 left-0 z-20">
        <Image src="/logo.png" alt="logo" width={200} height={200} />

        <div className="border-2 border-white w-[800px] rounded-lg px-2">
          <Select
            options={allTags}
            placeholder="検索"
            onChange={(e: SelectItem[]) => {
              setSelectTags(e.map((item) => item.value));
              router.push("/");
            }}
            isMulti={true}
            value={allTags.filter((item) => selectTags.includes(item.value))}
          />
        </div>
      </div>
      <div className="h-14" />
    </div>
  );
}
