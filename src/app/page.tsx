"use client";

import { ImageIndex } from "@/api/ImageIndex";
import { useSearchTags } from "@/SearchTagsProvider";
import Image from "next/image";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry from "react-masonry-css";

export default function Page() {
  const [loadingCount, setLoadingCount] = useState(0);
  const { searchTags } = useSearchTags();
  const [images, setImages] = useState<
    {
      id: number;
      url: string;
      tags: string[];
    }[]
  >([]);
  const [hasMore, setHasMore] = useState(true);

  const indexApi = async (isInit: boolean = false) => {
    const response = await ImageIndex({
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
    <div className="pt-2">
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
            <Image
              key={image.id}
              className="!w-full !h-auto mb-2"
              src={image.url}
              alt={image.tags.join(", ")}
              width={100}
              height={100}
            />
          ))}
        </Masonry>
      </InfiniteScroll>
    </div>
  );
}
