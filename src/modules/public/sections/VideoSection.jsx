import Cyborg from "../../../assets/video/Cyborg.mp4"

export default function VideoSection() {
  return (
    <div className="relative w-full bg-black overflow-hidden" style={{ height: '1080px' }}>
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
  );
}
