import { ImageIndexResponse } from "@/api/ImageIndex";
import { Modal } from "./Modal";
import Image from "next/image";
import { Select, SelectItem } from "./Select";
import React, { useEffect, useState } from "react";
import { TagSelect } from "@/api/TagSelect";
import { CloseIcon } from "./icons/CloseIcon";
import Cookies from "js-cookie";
import { LibraryStore } from "@/api/LibraryStore";
import  { useRouter } from "next/navigation";

export interface AddLibraryModalProps {
  selectedImage: ImageIndexResponse["images"][number];
  setSelectedImage: React.Dispatch<React.SetStateAction<ImageIndexResponse["images"][number] | null>>;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AddLibraryModal({
  selectedImage,
  setSelectedImage,
  setIsOpenModal,
}: AddLibraryModalProps) {
  const [allTags, setAllTags] = useState<SelectItem[]>([]);
  useEffect(() => {
    const selectApi = async () => {
      const response = await TagSelect();
      setAllTags(response.tags);
    };

    selectApi();
  }, []);

  const storeApi = async () => {
    const response = await LibraryStore({
      image: {
        id: selectedImage.id,
        tags: selectedImage.tags,
      },
    });
    alert(response.messages[0]);
    if (response.success) {
      setIsOpenModal(false);
    }
  }
  const authToken = Cookies.get("authToken");
  const router = useRouter();

  return (
    <Modal onClese={() => setIsOpenModal(false)}>
      <div className="w-[800px] h-[500px] bg-black rounded-xl grid grid-cols-2 gap-4 p-4 overflow-auto">
        <Image
          unoptimized={true}
          className="!w-full !h-auto rounded-lg"
          src={selectedImage?.url ?? ""}
          alt={selectedImage?.tags.join(", ") ?? ""}
          width={100}
          height={100}
        />
        <div>
        <div className="flex flex-col gap-6 h-72">
          <div className="border-2 border-white w-full rounded-lg px-2">
            <Select
              options={allTags.filter(
                (item) => !selectedImage?.tags.includes(item.value)
              )}
              placeholder="タグ編集（5つまで）"
              onChange={(e: SelectItem) => {
                if (selectedImage.tags.length < 5) {
                  setSelectedImage((image) => {
                    if (!image) return image;
                    return ({
                    ...image,
                    tags: [...image.tags, e.value],
                  })});
                }
              }}
              value={null}
              isClearable={true}
            />
          </div>
          <div className="flex flex-col gap-4">
            {selectedImage?.tags.map((tag, index) => (
              <div key={index} className="flex items-center gap-2">
                <button
                  className="bg-white text-black w-8 h-8 flex justify-center items-center rounded-full"
                  onClick={() =>{
                    setSelectedImage((image) => {
                      if (!image) return image;
                      return ({
                      ...image,
                      tags: image.tags.filter((_, i) => i !== index),
                      });
                    })
                  }}
                >
                  <CloseIcon />
                </button>
                <div className="font-bold overflow-x-auto max-w-[300px] no-scrollbar">{tag}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            className="bg-white text-black font-bold px-8 py-2 rounded-lg mt-8 ring-white hover:bg-black hover:ring-2 hover:text-white transition duration-700"
            onClick={() => {
              if (!authToken) {
                router.push("/login");
              } else {
                storeApi()
              }
            }}
          >
            マイラリブラリに追加
          </button>
        </div>
        </div>
      </div>
    </Modal>
  );
}
