import IconButton from '@mui/material/IconButton';
import YouTubeIcon   from '@mui/icons-material/YouTube';
import FacebookIcon  from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import RedditIcon    from '@mui/icons-material/Reddit';

// Custom TikTok icon (not in MUI)
const TikTokIcon = () => (
  <svg fill="currentColor" viewBox="0 0 24 24" width="20" height="20">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

// Social icon button — shared style
const SocialBtn = ({ href, children }) => (
  <IconButton
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    size="small"
    sx={{
      color: '#fff',
      padding: '6px',
      '&:hover': { opacity: 0.7, backgroundColor: 'transparent' },
    }}
  >
    {children}
  </IconButton>
);

const Footer = ({
  locationTitle = "Our Location",
  address       = "Ozone Computers Nonagama Hwy road, Embilipitiya",
  phone         = "0742789533",
  email         = "info@ozonecomputers.lk",
  copyrightText = "© 2026 All rights reserved by Hash Developers",
  socialLinks   = { tiktok: "#", youtube: "#", facebook: "#", reddit: "#", instagram: "#" },
  onPrivacyClick,
  onTermsClick,
}) => {
  const INTER = { fontFamily: 'Inter, sans-serif' };

  return (
    <footer className="w-full bg-black text-white">

      {/*
        Responsive horizontal padding:
        mobile  → 16px
        sm      → 32px
        md      → 64px
        lg      → 120px
        xl      → 200px
        2xl     → 350px  (≈ 1920px design)
      */}
      <div className="mx-auto py-6 px-4 sm:px-8 md:px-16 lg:px-[120px] xl:px-[200px] 2xl:px-[350px]">

        {/* ── Main row: Location  |  Contact + Socials ── */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-4">

          {/* LEFT — Location info */}
          <div className="flex flex-col gap-1 min-w-0">
            <h3
              className="font-semibold text-[15px] text-white mb-1"
              style={INTER}
            >
              {locationTitle}
            </h3>
            <p className="text-[13px] text-white/80 font-normal leading-relaxed" style={INTER}>
              {address}
            </p>
            <p className="text-[13px] text-white/80 font-normal" style={INTER}>
              {phone}
            </p>
            <a
              href={`mailto:${email}`}
              className="text-[13px] text-white/80 font-normal hover:text-white hover:underline transition-colors"
              style={INTER}
            >
              {email}
            </a>
          </div>

          {/* RIGHT — Contact heading + social icons */}
          <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
            <h3 className="font-semibold text-[15px] text-white" style={INTER}>
              Contact
            </h3>

            {/* All 5 social icons in a single row on all screen sizes */}
            <div className="flex flex-row items-center gap-0.5">
              <SocialBtn href={socialLinks.tiktok}>
                <TikTokIcon />
              </SocialBtn>
              <SocialBtn href={socialLinks.youtube}>
                <YouTubeIcon style={{ fontSize: 20 }} />
              </SocialBtn>
              <SocialBtn href={socialLinks.facebook}>
                <FacebookIcon style={{ fontSize: 20 }} />
              </SocialBtn>
              <SocialBtn href={socialLinks.reddit}>
                <RedditIcon style={{ fontSize: 20 }} />
              </SocialBtn>
              <SocialBtn href={socialLinks.instagram}>
                <InstagramIcon style={{ fontSize: 20 }} />
              </SocialBtn>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="w-full h-px bg-white/10 my-4" />

        {/* ── Bottom row: Copyright  |  Policy links ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">

          <p className="text-[12px] text-white/60 font-normal text-center sm:text-left" style={INTER}>
            {copyrightText}
          </p>

          <div className="flex flex-row gap-5">
            <button
              onClick={onPrivacyClick}
              className="text-[12px] text-white/60 font-normal bg-transparent border-none cursor-pointer hover:text-white hover:underline transition-colors"
              style={INTER}
            >
              Privacy and Policy
            </button>
            <button
              onClick={onTermsClick}
              className="text-[12px] text-white/60 font-normal bg-transparent border-none cursor-pointer hover:text-white hover:underline transition-colors"
              style={INTER}
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
