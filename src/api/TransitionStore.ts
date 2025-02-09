import axios from "axios";

export interface TransitionStoreProps {
    sourceImageId: number;
    destinationImageId: number;
}

export async function TransitionStore({
    sourceImageId,
    destinationImageId,
}: TransitionStoreProps): Promise<void> {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/transition`;

    await axios.post(apiUrl, {
        sourceImageId,
        destinationImageId,
    });
}
