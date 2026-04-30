import IconButton from '@mui/material/IconButton';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import RedditIcon from '@mui/icons-material/Reddit';

// Custom TikTok Icon (MUI doesn't have TikTok icon)
const TikTokIcon = () => (
  <svg 
    fill="currentColor" 
    viewBox="0 0 24 24" 
    width="20" 
    height="20"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const Footer = ({
  locationTitle = "Our Location",
  address = "Ozone Computers Nonagama Hwy road, Embilipitiya",
  phone = "0742789533",
  email = "info@ozonecomputers.lk",
  copyrightText = "© 2026 All rights reserved by Hash Developers",
  socialLinks = {
    tiktok: "#",
    youtube: "#",
    facebook: "#",
    reddit: "#",
    instagram: "#"
  },
  onPrivacyClick,
  onTermsClick
}) => {
  return (
    <footer className="w-full bg-black text-white">
      <div className="max-w-[1920px] mx-auto py-6 px-4 md:px-8 lg:px-80">
        {/* Main Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-6 md:gap-0">
          
          {/* Left - Location Info */}
          <div className="flex flex-col gap-1">
            <h3 
              className="font-semibold text-sm text-white mb-1"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {locationTitle}
            </h3>
            <p 
              className="text-xs text-white font-normal"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {address}
            </p>
            <p 
              className="text-xs text-white font-normal"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {phone}
            </p>
            <a 
              href={`mailto:${email}`}
              className="text-xs text-white font-normal hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {email}
            </a>
          </div>

          {/* Right - Contact & Social */}
          <div className="flex flex-col items-start md:items-end gap-2">
            <h3 
              className="font-semibold text-sm text-white"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Contact
            </h3>
            
            {/* Social Icons */}
            <div className="flex flex-col gap-1">
              {/* Top Row - TikTok, YouTube, Facebook */}
              <div className="flex flex-row gap-1 justify-end">
                <IconButton
                  href={socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!p-1 !text-white hover:!opacity-70 transition-opacity"
                  size="small"
                >
                  <TikTokIcon />
                </IconButton>
                <IconButton
                  href={socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!p-1 !text-white hover:!opacity-70 transition-opacity"
                  size="small"
                >
                  <YouTubeIcon style={{ fontSize: 20 }} />
                </IconButton>
                <IconButton
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!p-1 !text-white hover:!opacity-70 transition-opacity"
                  size="small"
                >
                  <FacebookIcon style={{ fontSize: 20 }} />
                </IconButton>
              </div>
              
              {/* Bottom Row - Reddit, Instagram */}
              <div className="flex flex-row gap-1 justify-end">
                <IconButton
                  href={socialLinks.reddit}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!p-1 !text-white hover:!opacity-70 transition-opacity"
                  size="small"
                >
                  <RedditIcon style={{ fontSize: 20 }} />
                </IconButton>
                <IconButton
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!p-1 !text-white hover:!opacity-70 transition-opacity"
                  size="small"
                >
                  <InstagramIcon style={{ fontSize: 20 }} />
                </IconButton>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gray-700 my-4"></div>

        {/* Bottom - Copyright & Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          {/* Copyright */}
          <p 
            className="text-xs text-white font-normal"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {copyrightText}
          </p>

          {/* Links */}
          <div className="flex flex-row gap-6">
            <button
              onClick={onPrivacyClick}
              className="text-xs text-white font-normal bg-transparent border-none cursor-pointer hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Privacy and Policy
            </button>
            <button
              onClick={onTermsClick}
              className="text-xs text-white font-normal bg-transparent border-none cursor-pointer hover:underline"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Terms of Use
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
