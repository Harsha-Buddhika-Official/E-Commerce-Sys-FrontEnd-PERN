import StorefrontOutlinedIcon    from "@mui/icons-material/StorefrontOutlined";
import EmojiObjectsOutlinedIcon  from "@mui/icons-material/EmojiObjectsOutlined";
import HandshakeOutlinedIcon     from "@mui/icons-material/HandshakeOutlined";
import VerifiedOutlinedIcon      from "@mui/icons-material/VerifiedOutlined";
import SupportAgentOutlinedIcon  from "@mui/icons-material/SupportAgentOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import BuildOutlinedIcon         from "@mui/icons-material/BuildOutlined";
import PeopleAltOutlinedIcon     from "@mui/icons-material/PeopleAltOutlined";

// ─── Font constants — leaf elements ONLY, never on wrapper divs ───────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Static data ──────────────────────────────────────────────────────────────
const STATS = [
  { value: "10+",  label: "Years in Business"  },
  { value: "50K+", label: "Products Sold"       },
  { value: "15K+", label: "Happy Customers"     },
  { value: "500+", label: "Brands & Products"   },
];

const VALUES = [
  {
    icon: <VerifiedOutlinedIcon style={{ fontSize: 26 }} />,
    title: "Genuine Products",
    desc:  "Every product is 100% authentic, sourced directly from authorised distributors and brand partners.",
  },
  {
    icon: <SupportAgentOutlinedIcon style={{ fontSize: 26 }} />,
    title: "Expert Support",
    desc:  "Our team of tech enthusiasts guides you before purchase, during setup, and long after delivery.",
  },
  {
    icon: <LocalShippingOutlinedIcon style={{ fontSize: 26 }} />,
    title: "Island-Wide Delivery",
    desc:  "Fast, secure doorstep delivery across every corner of Sri Lanka through trusted courier partners.",
  },
  {
    icon: <BuildOutlinedIcon style={{ fontSize: 26 }} />,
    title: "Warranty Service",
    desc:  "We handle warranty claims in-house — most suppliers are local, so turnaround is faster than anywhere else.",
  },
  {
    icon: <HandshakeOutlinedIcon style={{ fontSize: 26 }} />,
    title: "Honest Pricing",
    desc:  "Transparent, competitive prices with no hidden fees. What you see is exactly what you pay.",
  },
  {
    icon: <EmojiObjectsOutlinedIcon style={{ fontSize: 26 }} />,
    title: "Build Consultations",
    desc:  "Planning a custom PC build? Our specialists help you pick the right parts for your budget and use case.",
  },
];

const TEAM = [
  { name: "Kasun Perera",   role: "Founder & CEO",          initials: "KP" },
  { name: "Dinesh Silva",   role: "Head of Sales",           initials: "DS" },
  { name: "Amali Fernando", role: "Customer Success Lead",   initials: "AF" },
  { name: "Ruwan Bandara",  role: "Technical Specialist",    initials: "RB" },
];

// ─── Reusable section heading ─────────────────────────────────────────────────
function SectionHeading({ title, subtitle }) {
  return (
    <div className="flex flex-col items-center text-center mb-10">
      <h2 className="text-[#111] leading-tight mb-2" style={{ ...SORA, fontSize: 32, fontWeight: 800, letterSpacing: "-0.8px" }}>
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-400 max-w-xl" style={{ ...INTER, fontSize: 15, fontWeight: 400 }}>
          {subtitle}
        </p>
      )}
      <div className="mt-4 w-12 h-[3px] bg-[#111] rounded-full" />
    </div>
  );
}

// ─── AboutPage ────────────────────────────────────────────────────────────────
const AboutPage = () => (
  <div className="w-full min-h-screen bg-[#f5f5f5]">

    <style>{`
      .about-padded { padding-left: 350px; padding-right: 350px; }
      @media (max-width: 1600px) { .about-padded { padding-left: 160px; padding-right: 160px; } }
      @media (max-width: 1280px) { .about-padded { padding-left: 60px;  padding-right: 60px;  } }
      @media (max-width: 1024px) { .about-padded { padding-left: 32px;  padding-right: 32px;  } }
      @media (max-width: 640px)  { .about-padded { padding-left: 16px;  padding-right: 16px;  } }

      .about-values-grid { grid-template-columns: repeat(3, 1fr); }
      @media (max-width: 1024px) { .about-values-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 600px)  { .about-values-grid { grid-template-columns: repeat(1, 1fr); } }

      .about-team-grid { grid-template-columns: repeat(4, 1fr); }
      @media (max-width: 1024px) { .about-team-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 500px)  { .about-team-grid { grid-template-columns: repeat(1, 1fr); } }

      .about-stats-grid { grid-template-columns: repeat(4, 1fr); }
      @media (max-width: 860px)  { .about-stats-grid { grid-template-columns: repeat(2, 1fr); } }
      @media (max-width: 480px)  { .about-stats-grid { grid-template-columns: repeat(1, 1fr); } }
    `}</style>

    <div className="about-padded pt-10 pb-20">

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[#111] mb-5">
          <StorefrontOutlinedIcon style={{ fontSize: 32, color: "#fff" }} />
        </div>
        <h1 className="text-[#111] leading-none mb-3" style={{ ...SORA, fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px" }}>
          About Ozone Computers
        </h1>
        <p className="text-gray-500 max-w-2xl" style={{ ...INTER, fontSize: 16, fontWeight: 400, lineHeight: 1.75 }}>
          Sri Lanka's trusted destination for genuine PC components, laptops, and peripherals.
          Powering builds, offices, and gaming setups since 2014 — with expertise you can count on.
        </p>
      </div>

      {/* ══ STATS ═════════════════════════════════════════════════════════════ */}
      <div className="about-stats-grid grid gap-4 mb-16">
        {STATS.map((s, i) => (
          <div key={i} className="bg-white border border-[#e6e6e6] rounded-2xl flex flex-col items-center justify-center py-8 px-4 text-center">
            <span className="text-[#111] leading-none mb-1" style={{ ...SORA, fontSize: 40, fontWeight: 900, letterSpacing: "-1px" }}>
              {s.value}
            </span>
            <span className="text-gray-400 uppercase tracking-widest" style={{ ...INTER, fontSize: 11, fontWeight: 600 }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* ══ OUR STORY ═════════════════════════════════════════════════════════ */}
      <div className="bg-white border border-[#e6e6e6] rounded-2xl p-10 mb-16">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* Text column */}
          <div className="flex-1">
            <h2 className="text-[#111] mb-3 leading-tight" style={{ ...SORA, fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" }}>
              Our Story
            </h2>
            <div className="w-10 h-[3px] bg-red-500 rounded-full mb-6" />
            <p className="text-gray-600 mb-4" style={{ ...INTER, fontSize: 14, fontWeight: 400, lineHeight: 1.8 }}>
              Ozone Computers started in 2014 with a simple idea — make high-quality PC hardware accessible
              to every Sri Lankan, whether they're a gamer, a professional, or someone building their first machine.
            </p>
            <p className="text-gray-600 mb-4" style={{ ...INTER, fontSize: 14, fontWeight: 400, lineHeight: 1.8 }}>
              What began as a small retail shop in Colombo has grown into one of the country's most trusted
              technology retailers, with an extensive catalogue of processors, GPUs, laptops, monitors,
              and everything in between.
            </p>
            <p className="text-gray-600" style={{ ...INTER, fontSize: 14, fontWeight: 400, lineHeight: 1.8 }}>
              Today we serve thousands of customers island-wide through our physical store and online platform —
              backed by genuine warranties, real after-sales support, and a team that genuinely loves technology.
            </p>
          </div>

          {/* Dark accent card */}
          <div className="flex-shrink-0 w-full lg:w-60">
            <div className="bg-[#111] rounded-2xl p-7 text-white flex flex-col gap-6 h-full">
              {[
                { label: "Established", value: "2014" },
                { label: "Location",    value: "Colombo, Sri Lanka" },
                { label: "Speciality",  value: "PC Components & Laptops" },
              ].map((item, i, arr) => (
                <div key={i}>
                  <span className="text-gray-400 uppercase tracking-widest block mb-1" style={{ ...INTER, fontSize: 10, fontWeight: 600 }}>
                    {item.label}
                  </span>
                  <span className="text-white" style={{ ...(i === 0 ? SORA : INTER), fontSize: i === 0 ? 40 : 14, fontWeight: i === 0 ? 900 : 600 }}>
                    {item.value}
                  </span>
                  {i < arr.length - 1 && <div className="mt-5 h-px bg-white/10" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ VALUES ════════════════════════════════════════════════════════════ */}
      <div className="mb-16">
        <SectionHeading
          title="Why Choose Us"
          subtitle="Everything we do is built around giving you the best possible experience — from browsing to delivery."
        />
        <div className="about-values-grid grid gap-5">
          {VALUES.map((v, i) => (
            <div
              key={i}
              className="bg-white border border-[#e6e6e6] rounded-2xl p-6 flex flex-col gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#f5f5f5] text-[#111]">
                {v.icon}
              </div>
              <h3 className="text-[#111]" style={{ ...SORA, fontSize: 15, fontWeight: 700 }}>
                {v.title}
              </h3>
              <p className="text-gray-500" style={{ ...INTER, fontSize: 13, fontWeight: 400, lineHeight: 1.7 }}>
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ TEAM ══════════════════════════════════════════════════════════════ */}
      <div>
        <SectionHeading
          title="Meet the Team"
          subtitle="The people behind Ozone Computers — passionate about tech, committed to you."
        />
        <div className="about-team-grid grid gap-5">
          {TEAM.map((member, i) => (
            <div
              key={i}
              className="bg-white border border-[#e6e6e6] rounded-2xl p-6 flex flex-col items-center text-center gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)]"
            >
              <div className="w-16 h-16 rounded-full bg-[#111] flex items-center justify-center flex-shrink-0">
                <span className="text-white" style={{ ...SORA, fontSize: 18, fontWeight: 800 }}>
                  {member.initials}
                </span>
              </div>
              <div>
                <p className="text-[#111]" style={{ ...SORA, fontSize: 14, fontWeight: 700 }}>
                  {member.name}
                </p>
                <p className="text-gray-400 mt-0.5" style={{ ...INTER, fontSize: 12, fontWeight: 500 }}>
                  {member.role}
                </p>
              </div>
              <PeopleAltOutlinedIcon style={{ fontSize: 16, color: "#ddd" }} />
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

export default AboutPage;
