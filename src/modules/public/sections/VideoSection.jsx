import Cyborg from "../../../assets/video/Cyborg.mp4";

export default function VideoSection() {
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
            <source src={Cyborg} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Optional: Overlay for better text readability if needed */}
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>
    </div>
  );
}
