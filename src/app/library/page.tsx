"use client";

import { LibraryIndex, LibraryIndexResponse } from "@/api/LibraryIndex";
import { DeleteIcon } from "@/components/icons/DeleteIcon";
import { SettingIcon } from "@/components/icons/SettingIcon";
import { NavigateButtons } from "@/components/NavigateButtons";
import { UpdateLibraryModal } from "@/components/UpdateLibraryModal";
import { useSearchTags } from "@/SearchTagsProvider";
import Image from "next/image";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";

export default function Page() {
  const { searchTags } = useSearchTags();
  const [images, setImages] = useState<LibraryIndexResponse["images"]>([]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    LibraryIndexResponse["images"][number] | null
  >(null);

  // 一覧取得
  const indexApi = async (loadingCount: number) => {
    const response = await LibraryIndex({
      loadingCount: loadingCount,
      searchTags: searchTags,
    });

    if (response.images.length > 0) {
      setImages((prevImages) => {
        const existingIds = prevImages.map((image) => image.id);
        const newImages = response.images.filter(
          (image) => !existingIds.includes(image.id)
        );
        return [...prevImages, ...newImages];
      });
      indexApi(loadingCount + 1);
    }
  };

  useEffect(() => {
    setImages([]);
    indexApi(0);
  }, [searchTags]);

  return (
    <>
      <div className="pt-2 pb-32 px-10 relative overflow-y-scroll h-screen">
        {/* <InfiniteScroll
          dataLength={images.length}
          next={indexApi}
          hasMore={hasMore}
          loader={<></>}
        > */}
        <Masonry
          breakpointCols={5}
          className="flex gap-2"
          columnClassName="pb-2"
        >
          {images.map((image) => (
            <div className="relative group" key={image.id}>
              <Image
                unoptimized={true}
                className="!w-full !h-auto mb-2 rounded-lg"
                src={image.url}
                alt={image.tags.join(", ")}
                width={100}
                height={100}
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="absolute top-5 right-5 flex gap-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setSelectedImage(image);
                    setIsOpenModal(true);
                  }}
                >
                  <SettingIcon />
                </button>
                <button>
                  <DeleteIcon />
                </button>
              </div>
            </div>
          ))}
        </Masonry>
        {/* </InfiniteScroll> */}
      </div>

      <div className="fixed bottom-10 right-24">
        <NavigateButtons />
      </div>

      {isOpenModal && selectedImage && (
        <UpdateLibraryModal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setIsOpenModal={setIsOpenModal}
        />
      )}
    </>
  );
}
