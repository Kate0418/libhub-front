"use client";

import { LibraryIndex, LibraryIndexResponse } from "@/api/LibraryIndex";
import { AddLibraryModal } from "@/components/AddLibraryModal";
import { BookMarkHeartIcon } from "@/components/icons/BookMarkHeartIcon";
import { NavigateButtons } from "@/components/NavigateButtons";
import { useSearchTags } from "@/SearchTagsProvider";
import Image from "next/image";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";

export default function Page() {
  const [loadingCount, setLoadingCount] = useState(0);
  const { searchTags } = useSearchTags();
  const [images, setImages] = useState<LibraryIndexResponse["images"]>([]);
  const [hasMore, setHasMore] = useState(true);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    LibraryIndexResponse["images"][number] | null
  >(null);

  const indexApi = async (isInit: boolean = false) => {
    const response = await LibraryIndex({
      loadingCount: isInit ? 0 : loadingCount,
      searchTags: searchTags,
    });
    setLoadingCount((loadingCount) => loadingCount + 1);

    if (isInit) {
      setHasMore(true);
      setImages(response.images);
      setLoadingCount(1);
    } else if (response.images.length > 0) {
      setImages([...images, ...response.images]);
    } else {
      setHasMore(false);
    }
  };

  useEffect(() => {
    indexApi();
  }, []);

  useEffect(() => {
    indexApi(true);
  }, [searchTags]);

  return (
    <>
      <div className="pt-2 relative">
        <InfiniteScroll
          dataLength={images.length}
          next={indexApi}
          hasMore={hasMore}
          loader={<></>}
        >
          <Masonry
            breakpointCols={4}
            className="flex gap-2"
            columnClassName="pb-2"
          >
            {images.map((image) => (
              <div className="relative group" key={image.id}>
                <Image
                  className="!w-full !h-auto mb-2 rounded-lg"
                  src={image.url}
                  alt={image.tags.join(", ")}
                  width={100}
                  height={100}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity">
                  <button
                    onClick={() => {
                      setSelectedImage(image);
                      setIsOpenModal(true);
                    }}
                  >
                    <BookMarkHeartIcon />
                  </button>
                </div>
              </div>
            ))}
          </Masonry>
        </InfiniteScroll>
      </div>

      <div className="fixed bottom-10 right-24">
        <NavigateButtons />
      </div>

      {/* {isOpenModal && selectedImage && (
        <AddLibraryModal
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
          setIsOpenModal={setIsOpenModal}
        />
      )} */}
    </>
  );
}
