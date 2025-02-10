"use client";

import { ImageIndex, ImageIndexResponse } from "@/api/ImageIndex";
import { ImageView } from "@/api/ImageView";
import {
  TransitionIndex,
  TransitionIndexResponse,
} from "@/api/TransitionIndex";
import { TransitionStore } from "@/api/TransitionStore";
import { AddLibraryModal } from "@/components/AddLibraryModal";
import { Button } from "@/components/Button";
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
  const [transitionImage, setTransitionImage] = useState<
    TransitionIndexResponse["images"]
  >([]);

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
    setSelectedImage(null);
    setImages([]);
    indexApi(0);
  }, [searchTags]);

  useEffect(() => {
    if (selectedImage) {
      const transitionApi = async () => {
        const response = await TransitionIndex({
          imageId: selectedImage.id,
        });
        setTransitionImage(response.images);
      };
      transitionApi();
    }
  }, [selectedImage]);

  return (
    <>
      <div className="flex gap-2 px-10">
        <div className="pt-2 pb-24 relative overflow-y-scroll h-screen w-auto">
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
                    ImageView({ imageId: image.id });
                    setSelectedImage(image);
                  }}
                />
              </div>
            ))}
          </Masonry>
          {/* </InfiniteScroll> */}
        </div>

        {selectedImage && (
          <div className="relative bg-white text-black rounded-xl">
            <div className="h-[calc(100vh-80px)] overflow-y-scroll no-scrollbar p-5">
              <Image
                unoptimized={true}
                className="w-[500px] h-auto rounded-lg"
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
                className="w-full bg-black text-white font-bold px-8 py-4 rounded-lg mb-5 ring-black hover:bg-white hover:ring-2 hover:text-black transition duration-700"
                onClick={() => {
                  setIsOpenModal(true);
                }}
              >
                マイライブラリに追加
              </button>

              <Masonry
                breakpointCols={2}
                className="flex gap-2"
                columnClassName="pb-2"
              >
                {transitionImage.map((image) => (
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
                        TransitionStore({
                          sourceImageId: selectedImage.id,
                          destinationImageId: image.id,
                        });
                        setSelectedImage(image);
                      }}
                    />
                  </div>
                ))}
              </Masonry>
            </div>

            {isOpenModal && (
              <AddLibraryModal
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                setIsOpenModal={setIsOpenModal}
              />
            )}

            <button
              className="absolute top-5 right-5 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center border-2 border-white"
              onClick={() => setSelectedImage(null)}
            >
              <CloseIcon />
            </button>
          </div>
        )}
      </div>

      <div
        className={`fixed bottom-10 right-24 ${
          selectedImage ? "right-[480px]" : ""
        }`}
      >
        <NavigateButtons />
      </div>
    </>
  );
}
