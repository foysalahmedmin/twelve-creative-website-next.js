import { notFound } from "next/navigation";
import { ApiError } from "@/lib/admin/types";
import { getShowcaseVideoById } from "@/lib/api/showcase-videos";
import { VideoForm } from "../../video-form";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditShowcaseVideoPage({ params }: PageProps) {
  const { id } = await params;
  try {
    const video = await getShowcaseVideoById(id);
    return <VideoForm mode="edit" initial={video} />;
  } catch (e) {
    if (e instanceof ApiError && e.status === 404) notFound();
    throw e;
  }
}
