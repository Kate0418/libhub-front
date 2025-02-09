"use client";

import { ImageIndex, ImageIndexResponse } from "@/api/ImageIndex";
import { AddLibraryModal } from "@/components/AddLibraryModal";
import { Button } from "@/components/Button";
import { BookMarkHeartIcon } from "@/components/icons/BookMarkHeartIcon";
import { CloseIcon } from "@/components/icons/CloseIcon";
import { NavigateButtons } from "@/components/NavigateButtons";
import { useSearchTags } from "@/SearchTagsProvider";
import Image from "next/image";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css";

export default function Page() {
  const { searchTags } = useSearchTags();
  const [images, setImages] = useState<ImageIndexResponse["images"]>([]);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    ImageIndexResponse["images"][number] | null
  >(null);

  // 一覧取得
  const indexApi = async (loadingCount: number) => {
    const response = await ImageIndex({
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
      <div className="flex gap-2 px-10">
        <div className="pt-2 pb-24 relative overflow-y-scroll h-screen">
          {/* <InfiniteScroll
          dataLength={images.length}
          next={() => {}}
          hasMore={hasMore}
          loader={<></>}
        > */}
          <Masonry
            breakpointCols={selectedImage ? 4 : 5}
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
                <div
                  className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity"
                  onClick={() => {
                    setSelectedImage(image);
                  }}
                />
              </div>
            ))}
          </Masonry>
          {/* </InfiniteScroll> */}
        </div>

        {selectedImage && (
          <>
            <div className="relative w-[calc(100%+450px)] h-[calc(100vh-80px)] overflow-y-scroll bg-white text-black p-5 rounded-xl">
              <Image
                unoptimized={true}
                className="w-full h-auto rounded-lg"
                src={selectedImage.url}
                alt={selectedImage.tags.join(", ")}
                width={100}
                height={100}
              />
              <div className="flex py-2 overflow-x-auto max-w-[400px] no-scrollbar">
                {selectedImage.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="bg-black text-white font-bold py-1 rounded-lg mr-2 w-[80px] overflow-x-auto whitespace-nowrap no-scrollbar"
                  >
                    <div className="animate-marquee inline-block">{tag}</div>
                  </div>
                ))}
              </div>

              <button
                className="w-full bg-black text-white font-bold px-8 py-2 rounded-lg mb-5 ring-black hover:bg-white hover:ring-2 hover:text-black transition duration-700"
                onClick={() => {
                  setIsOpenModal(true);
                }}
              >
                マイライブラリに追加
              </button>

              <button
                className="absolute top-10 right-10 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center border-2 border-white"
                onClick={() => setSelectedImage(null)}
              >
                <CloseIcon />
              </button>
            </div>

            {isOpenModal && (
              <AddLibraryModal
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                setIsOpenModal={setIsOpenModal}
              />
            )}
          </>
        )}
      </div>

      <div
        className={`fixed bottom-10 right-24 ${
          selectedImage ? "right-[500px]" : ""
        }`}
      >
        <NavigateButtons />
      </div>
    </>
  );
}
