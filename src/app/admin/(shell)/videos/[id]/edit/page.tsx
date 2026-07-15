import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getShowcaseVideoById } from "@/lib/api/showcase-videos";
import { loadIndustryOptions } from "@/lib/admin/industry-options";
import { VideoForm } from "../../video-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditShowcaseVideoPage({ params }: PageProps) {
  const { id } = await params;
  const [videoResult, industries] = await Promise.all([
    loadShowcaseVideo(id),
    loadIndustryOptions(),
  ]);

  if (videoResult.error) {
    if (
      videoResult.error instanceof ApiError &&
      videoResult.error.status === 404
    ) {
      notFound();
    }
    throw videoResult.error;
  }

  return (
    <VideoForm
      mode="edit"
      initial={videoResult.data}
      industries={industries.data}
      industriesError={industries.error}
    />
  );
}

async function loadShowcaseVideo(id: string) {
  try {
    return { data: await getShowcaseVideoById(id), error: undefined };
  } catch (error) {
    return { data: undefined, error };
  }
}
