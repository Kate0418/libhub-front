import axios from 'axios';

export interface ImageViewProps {
  imageId: number;
}

export async function ImageView({ imageId }: ImageViewProps): Promise<void> {
  const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/image/view`;

  await axios.post(apiUrl, {
    imageId,
  });
}
