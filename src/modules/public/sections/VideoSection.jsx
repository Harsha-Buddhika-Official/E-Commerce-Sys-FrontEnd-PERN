import { useVideoBanner } from "../features/banners/hooks/useVideoBanner.js";

export default function VideoSection() {
  const { banners, loading, error } = useVideoBanner();

  if (loading) return null;
  if (error) return null;

  const videoUrl = banners[0]?.media_url;

  if (!videoUrl) return null;

  return (
    <div>
      {/* min-h-[56vw] ensures the video has visible height on narrow mobile screens
          where 100vh could feel excessive; 100vh is preserved for tablet and up */}
      <div className="relative w-full min-h-[56vw] sm:min-h-0 h-[60vw] sm:h-[100vh] overflow-hidden">
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

        {/* Overlay for readability */}
        <div className="absolute inset-0 bg-black opacity-30" />
      </div>
    </div>
  );
}