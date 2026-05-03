import { useState } from "react";
import LocationOnOutlinedIcon    from "@mui/icons-material/LocationOnOutlined";
import PhoneOutlinedIcon         from "@mui/icons-material/PhoneOutlined";
import EmailOutlinedIcon         from "@mui/icons-material/EmailOutlined";
import AccessTimeOutlinedIcon    from "@mui/icons-material/AccessTimeOutlined";
import SendOutlinedIcon          from "@mui/icons-material/SendOutlined";
import CheckCircleOutlinedIcon   from "@mui/icons-material/CheckCircleOutlined";
import WhatsAppIcon              from "@mui/icons-material/WhatsApp";
import FacebookOutlinedIcon      from "@mui/icons-material/FacebookOutlined";
import InstagramIcon             from "@mui/icons-material/Instagram";

// ─── Font constants — leaf elements ONLY, never on wrapper divs ───────────────
const SORA  = { fontFamily: "'Sora', 'Segoe UI', sans-serif" };
const INTER = { fontFamily: "'Inter', 'Segoe UI', sans-serif" };

// ─── Contact info cards data ──────────────────────────────────────────────────
const CONTACT_CARDS = [
  {
    icon:  <LocationOnOutlinedIcon style={{ fontSize: 24 }} />,
    title: "Visit Us",
    lines: ["123 Galle Road, Colombo 03", "Western Province, Sri Lanka"],
  },
  {
    icon:  <PhoneOutlinedIcon style={{ fontSize: 24 }} />,
    title: "Call Us",
    lines: ["+94 11 234 5678", "+94 77 890 1234"],
  },
  {
    icon:  <EmailOutlinedIcon style={{ fontSize: 24 }} />,
    title: "Email Us",
    lines: ["info@ozonecomputers.lk", "support@ozonecomputers.lk"],
  },
  {
    icon:  <AccessTimeOutlinedIcon style={{ fontSize: 24 }} />,
    title: "Opening Hours",
    lines: ["Mon – Sat: 9:00 AM – 7:00 PM", "Sunday: 10:00 AM – 4:00 PM"],
  },
];

const SUBJECTS = [
  "Product Inquiry",
  "Pre-Order Request",
  "Warranty / Repair",
  "Delivery Query",
  "Build Consultation",
  "Other",
];

// ─── Reusable labelled input ──────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[#111]" style={{ ...INTER, fontSize: 12, fontWeight: 600 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-[#e6e6e6] bg-[#fafafa] text-[#111] outline-none transition-all duration-150 focus:border-[#111] focus:bg-white placeholder:text-gray-300";

const inputStyle = { ...INTER, fontSize: 13, fontWeight: 400 };

// ─── ContactPage ──────────────────────────────────────────────────────────────
const ContactPage = () => {
  const [form, setForm]       = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission — replace with real API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    setSubmitted(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#f5f5f5]">

      <style>{`
        .contact-padded { padding-left: 350px; padding-right: 350px; }
        @media (max-width: 1600px) { .contact-padded { padding-left: 160px; padding-right: 160px; } }
        @media (max-width: 1280px) { .contact-padded { padding-left: 60px;  padding-right: 60px;  } }
        @media (max-width: 1024px) { .contact-padded { padding-left: 32px;  padding-right: 32px;  } }
        @media (max-width: 640px)  { .contact-padded { padding-left: 16px;  padding-right: 16px;  } }

        .contact-cards-grid { grid-template-columns: repeat(4, 1fr); }
        @media (max-width: 1100px) { .contact-cards-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 500px)  { .contact-cards-grid { grid-template-columns: repeat(1, 1fr); } }

        .contact-body { grid-template-columns: 1fr 420px; }
        @media (max-width: 1024px) { .contact-body { grid-template-columns: 1fr; } }
      `}</style>

      <div className="contact-padded pt-10 pb-20">

        {/* ══ HEADER ════════════════════════════════════════════════════════ */}
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-[#111] leading-none mb-3" style={{ ...SORA, fontSize: 48, fontWeight: 900, letterSpacing: "-1.5px" }}>
            Contact Us
          </h1>
          <p className="text-gray-400 max-w-xl" style={{ ...INTER, fontSize: 15, fontWeight: 400 }}>
            Have a question, need a quote, or want to discuss a build? We're here to help — reach out anytime.
          </p>
        </div>

        {/* ══ INFO CARDS ════════════════════════════════════════════════════ */}
        <div className="contact-cards-grid grid gap-4 mb-12">
          {CONTACT_CARDS.map((card, i) => (
            <div
              key={i}
              className="bg-white border border-[#e6e6e6] rounded-2xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-[#f5f5f5] text-[#111] flex-shrink-0">
                {card.icon}
              </div>
              <p className="text-[#111]" style={{ ...SORA, fontSize: 13, fontWeight: 700 }}>
                {card.title}
              </p>
              <div className="flex flex-col gap-0.5">
                {card.lines.map((line, j) => (
                  <p key={j} className="text-gray-500" style={{ ...INTER, fontSize: 12, fontWeight: 400 }}>
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ══ FORM + MAP ════════════════════════════════════════════════════ */}
        <div className="contact-body grid gap-6">

          {/* Contact form */}
          <div className="bg-white border border-[#e6e6e6] rounded-2xl p-8">
            <h2 className="text-[#111] mb-1" style={{ ...SORA, fontSize: 22, fontWeight: 800, letterSpacing: "-0.4px" }}>
              Send a Message
            </h2>
            <p className="text-gray-400 mb-7" style={{ ...INTER, fontSize: 13, fontWeight: 400 }}>
              Fill in the form below and we'll get back to you within 24 hours.
            </p>

            {submitted ? (
              /* Success state */
              <div className="flex flex-col items-center text-center py-12 gap-4">
                <CheckCircleOutlinedIcon style={{ fontSize: 52, color: "#16a34a" }} />
                <p className="text-[#111]" style={{ ...SORA, fontSize: 20, fontWeight: 800 }}>
                  Message Sent!
                </p>
                <p className="text-gray-400 max-w-sm" style={{ ...INTER, fontSize: 13, fontWeight: 400 }}>
                  Thank you for reaching out. Our team will reply to you within 24 hours.
                </p>
                <button
                  onClick={handleReset}
                  className="mt-2 px-6 py-2.5 rounded-xl bg-[#111] text-white transition-all duration-150 hover:bg-[#333]"
                  style={{ ...SORA, fontSize: 13, fontWeight: 700 }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* Name + Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Full Name *">
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Email Address *">
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="john@email.com"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </Field>
                </div>

                {/* Phone + Subject row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Phone Number">
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+94 77 000 0000"
                      className={inputClass}
                      style={inputStyle}
                    />
                  </Field>
                  <Field label="Subject *">
                    <select
                      required
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className={`${inputClass} cursor-pointer`}
                      style={{ ...inputStyle, color: form.subject ? "#111" : "#aaa" }}
                    >
                      <option value="" disabled>Select a subject…</option>
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s} style={{ color: "#111" }}>{s}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Message */}
                <Field label="Message *">
                  <textarea
                    required
                    rows={5}
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help…"
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                  />
                </Field>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#111] text-white transition-all duration-150 hover:bg-[#333] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                  style={{ ...SORA, fontSize: 14, fontWeight: 700, letterSpacing: "0.02em" }}
                >
                  {loading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <SendOutlinedIcon style={{ fontSize: 17 }} />
                  )}
                  {loading ? "Sending…" : "Send Message"}
                </button>

              </form>
            )}
          </div>

          {/* Right column: map placeholder + social links */}
          <div className="flex flex-col gap-5">

            {/* Map placeholder */}
            <div className="bg-white border border-[#e6e6e6] rounded-2xl overflow-hidden flex-1" style={{ minHeight: 260 }}>
              <div className="w-full h-full bg-[#f0f0f0] flex flex-col items-center justify-center gap-3 p-8 text-center" style={{ minHeight: 260 }}>
                <LocationOnOutlinedIcon style={{ fontSize: 36, color: "#ccc" }} />
                <p className="text-gray-400" style={{ ...INTER, fontSize: 13, fontWeight: 500 }}>
                  123 Galle Road, Colombo 03
                </p>
                <a
                  href="https://maps.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#111] text-[#111] transition-all duration-150 hover:bg-[#111] hover:text-white"
                  style={{ ...SORA, fontSize: 12, fontWeight: 600 }}
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            {/* Social + quick contact */}
            <div className="bg-white border border-[#e6e6e6] rounded-2xl p-6">
              <p className="text-[#111] mb-4" style={{ ...SORA, fontSize: 14, fontWeight: 700 }}>
                Quick Contact
              </p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: <WhatsAppIcon style={{ fontSize: 18 }} />, label: "WhatsApp", value: "+94 77 890 1234", color: "#16a34a" },
                  { icon: <FacebookOutlinedIcon style={{ fontSize: 18 }} />, label: "Facebook", value: "Ozone Computers", color: "#1877f2" },
                  { icon: <InstagramIcon style={{ fontSize: 18 }} />, label: "Instagram", value: "@ozonecomputers_lk", color: "#e1306c" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: s.color + "15", color: s.color }}
                    >
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-gray-400" style={{ ...INTER, fontSize: 10, fontWeight: 600 }}>
                        {s.label}
                      </p>
                      <p className="text-[#111]" style={{ ...INTER, fontSize: 12, fontWeight: 600 }}>
                        {s.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
