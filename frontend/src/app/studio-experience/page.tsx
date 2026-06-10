import React from "react";
import VideoHero from "@/components/VideoHero";
import StudioGallery from "@/components/StudioGallery";

async function getStudioConfig() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/studio-config/current/', { next: { revalidate: 60 } });
    if (!res.ok) return null;
    const data = await res.json();
    return Object.keys(data).length > 0 ? data : null;
  } catch (e) {
    return null;
  }
}

async function getGalleryItems() {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/content/studio-gallery/', { next: { revalidate: 60 } });
    if (!res.ok) return [];
    return res.json();
  } catch (e) {
    return [];
  }
}
export const metadata = {
  title: "Studio Experience | Optum Car Care",
  description: "Experience the premium Optum Car Care studio environment.",
};

export default async function StudioExperiencePage() {
  const config = await getStudioConfig();
  const rawGallery = await getGalleryItems();

  const title = config?.hero_title || "Studio Experience";
  const subtitle = config?.hero_subtitle || "Where Automotive Perfection is Born";
  const videoSrc = config?.hero_video_url || "https://cdn.pixabay.com/video/2021/08/04/83866-584733364_large.mp4";

  // Map API response to match StudioGallery component's expected structure
  const galleryItems = rawGallery.map((item: any) => ({
    id: item.id.toString(),
    src: item.image,
    alt: item.alt_text,
    category: item.category,
  }));

  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0a0a]">
      <VideoHero
        title={title}
        subtitle={subtitle}
        videoSrc={videoSrc}
      />

      <section className="py-20">
        <div className="text-center mb-10 px-4">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 dark:text-white">
            Our Masterpieces
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Browse through our gallery to witness the transformation and meticulous attention to detail we bring to every vehicle.
          </p>
        </div>

        <StudioGallery items={galleryItems} />
      </section>
    </main>
  );
}
