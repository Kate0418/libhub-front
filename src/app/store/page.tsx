"use client";

import { ImageStore, ImageStoreProps } from "@/api/ImageStore";
import { TagSelect } from "@/api/TagSelect";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { UploadFileIcon } from "@/components/icons/UploadFileIcon";
import { Select, SelectItem } from "@/components/Select";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [canSubmit, setCanSubmit] = useState(true);

  const [image, setImage] = useState<ImageStoreProps["image"]>({
    file: null,
    tags: [],
  });
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const [allTags, setAllTags] = useState<SelectItem[]>([]);
  useEffect(() => {
    const selectApi = async () => {
      const response = await TagSelect();
      setAllTags(response.tags);
    };

    selectApi();
  }, []);

  const storeApi = async () => {
    if (!canSubmit) return;
    setCanSubmit(false);
    const response = await ImageStore({ image });
    alert(response.messages[0]);
    if (response.success) {
      router.push("/");
    }
    setCanSubmit(true);
  };

  return (
    <div className="flex flex-col items-end">
      <div className="pt-16 flex justify-center gap-8">
        <div>
          <input
            className="hidden"
            type="file"
            accept="image/*"
            id="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFileUrl(URL.createObjectURL(file));
                setImage((image) => ({
                  ...image,
                  file: file,
                }));
              }
            }}
          />
          <label htmlFor="file">
            {fileUrl ? (
              <img
                src={fileUrl}
                className="w-[450px] h-auto rounded-lg border-dotted border-white border-4"
              />
            ) : (
              <div className="w-[450px] h-[450px] border-dotted rounded-lg border-white border-4 flex flex-col items-center justify-center gap-4">
                <UploadFileIcon />
                <div className="font-bold">画像をアップロード</div>
              </div>
            )}
          </label>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border-2 border-white w-[450px] rounded-lg px-2">
            <Select
              options={allTags.filter(
                (item) => !image.tags.includes(item.value)
              )}
              placeholder="タグ選択（5つまで）"
              onChange={(e: SelectItem) => {
                if (image.tags.length < 5) {
                  setImage((image) => ({
                    ...image,
                    tags: [...image.tags, e.value],
                  }));
                }
              }}
              value={null}
              isClearable={true}
            />
          </div>
          <div className="flex flex-col gap-4">
            {image.tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2">
                <button
                  className="bg-white w-8 h-8 flex justify-center items-center rounded-full"
                  onClick={() =>
                    setImage((image) => ({
                      ...image,
                      tags: image.tags.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <CloseIcon />
                </button>
                <div className="font-bold">{tag}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pr-8">
        <button
            className="bg-white text-black font-bold px-8 py-2 rounded-lg mt-8 ring-white hover:bg-black hover:ring-2 hover:text-white transition duration-700"
            onClick={() => storeApi()}
            disabled={!canSubmit}
        >
          追加
        </button>
      </div>
    </div>
  );
}
