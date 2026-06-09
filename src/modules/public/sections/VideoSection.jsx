import { useVideoBanner } from "../features/banners/hooks/useVideoBanner.js";

export default function VideoSection() {
  const { banners, loading, error } = useVideoBanner();

  if (loading) return null;
  if (error) return null;

  const videoUrl = banners[0]?.media_url;

  if (!videoUrl) return null;

  return (
    <div>
      <div className="relative w-full h-[100vh] overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <video
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Optional: Overlay for better text readability */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>
    </div>
  );
}