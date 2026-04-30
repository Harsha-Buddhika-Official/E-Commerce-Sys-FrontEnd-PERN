import { useState } from "react";
import {
  Box,
  Chip,
  Divider,
  IconButton,
  Rating,
  Tooltip,
} from "@mui/material";
import {
  ShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  Verified,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "@mui/icons-material";

const productImages = [
  "https://placehold.co/480x380/1a3a6b/ffffff?text=i9+Box+Front",
  "https://placehold.co/480x380/1a3a6b/ffffff?text=i9+Box+Side",
  "https://placehold.co/480x380/2c2c2c/ffffff?text=i9+Chip+Top",
];

const specs = [
  { label: "Processor Family", value: "Intel® Core™ 14th Gen" },
  { label: "Socket Type", value: "LGA 1700" },
  { label: "Core / Thread Count", value: "24 Cores (8P + 16E) / 32 Threads" },
  { label: "Base Frequency", value: "3.2 GHz" },
  { label: "Max Turbo Frequency", value: "Up to 6.0 GHz" },
  { label: "Cache", value: "36MB Intel® Smart Cache" },
  { label: "Architecture", value: "Raptor Lake Refresh" },
  { label: "Integrated Graphics", value: "Intel® UHD Graphics 770" },
  { label: "Memory Support", value: "DDR4-3200 / DDR5-5600" },
  { label: "PCI Express Support", value: "PCIe 5.0 & PCIe 4.0" },
  { label: "TDP (Base Power)", value: "125W" },
  { label: "Max Turbo Power", value: "253W" },
  { label: "Unlocked Multiplier", value: "Yes" },
  { label: "Cooler Included", value: "No" },
  { label: "OS Support", value: "Windows 10 / Windows 11" },
  { label: "Warranty", value: "3 Years" },
];

export default function ProductPage() {
  const [activeImg, setActiveImg] = useState(0);
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const prevImg = () => setActiveImg((p) => (p === 0 ? productImages.length - 1 : p - 1));
  const nextImg = () => setActiveImg((p) => (p === productImages.length - 1 ? 0 : p + 1));

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#f5f5f5",
        py: 4,
        px: { xs: 2, md: 4 },
        fontFamily: "'Sora', 'Segoe UI', sans-serif",
      }}
    >
      {/* ── Product Card ── */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          background: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 0,
        }}
      >
        {/* ── LEFT: Image Gallery ── */}
        <Box
          sx={{
            flex: "0 0 50%",
            background: "#f9f9f9",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 3,
            gap: 2,
            position: "relative",
            borderRight: { md: "1px solid #e5e5e5" },
          }}
        >
          {/* Main Image */}
          <Box sx={{ position: "relative", width: "100%", maxWidth: 350 }}>
            <Box
              component="img"
              src={productImages[activeImg]}
              alt="Product"
              sx={{
                width: "100%",
                borderRadius: 1,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
                display: "block",
              }}
            />
            <IconButton onClick={prevImg} sx={{
              position: "absolute", left: -18, top: "50%", transform: "translateY(-50%)",
              background: "#fff", boxShadow: 1,
              "&:hover": { background: "#fff" },
            }}>
              <ChevronLeft sx={{ color: "#333" }} />
            </IconButton>
            <IconButton onClick={nextImg} sx={{
              position: "absolute", right: -18, top: "50%", transform: "translateY(-50%)",
              background: "#fff", boxShadow: 1,
              "&:hover": { background: "#fff" },
            }}>
              <ChevronRight sx={{ color: "#333" }} />
            </IconButton>
          </Box>

          {/* Thumbnails */}
          <Box sx={{ display: "flex", gap: 1 }}>
            {productImages.map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                alt={`thumb-${i}`}
                onClick={() => setActiveImg(i)}
                sx={{
                  width: 56, height: 56, borderRadius: 1, cursor: "pointer", objectFit: "cover",
                  border: activeImg === i ? "2px solid #333" : "2px solid #ddd",
                  opacity: activeImg === i ? 1 : 0.6,
                  transition: "all .2s",
                  "&:hover": { opacity: 1 },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* ── RIGHT: Details ── */}
        <Box sx={{ flex: 1, p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Tags */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {["Processor", "Intel", "14th Gen"].map((tag) => (
              <Chip key={tag} label={tag} size="small" sx={{
                background: "#333", color: "#fff", fontWeight: 600,
                fontSize: 10, height: 24,
              }} />
            ))}
          </Box>

          {/* Title */}
          <Box>
            <Box component="h1" sx={{
              m: 0, fontSize: { xs: "1.3rem", md: "1.6rem" },
              fontWeight: 700, color: "#333", lineHeight: 1.3,
            }}>
              Intel® Core™ i9-14900K Desktop Processor
            </Box>
          </Box>

          {/* Rating */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Rating value={4.7} precision={0.1} readOnly size="small" sx={{ color: "#fbbf24" }} />
            <Box sx={{ fontSize: 12, color: "#666" }}>4.7 · 128 reviews</Box>
          </Box>

          <Divider sx={{ my: 1 }} />

          {/* Price */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ fontSize: "0.9rem", color: "#999", textDecoration: "line-through" }}>
              Rs. 260,000.00
            </Box>
            <Box sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#333" }}>
              Rs. 229,000.00
            </Box>
            <Chip label="−12%" size="small" sx={{
              background: "#fee2e2", color: "#dc2626", fontWeight: 700, fontSize: 11,
            }} />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
            <Box
              component="button"
              onClick={handleAdd}
              sx={{
                flex: 1, minWidth: 140,
                py: 1.2, px: 3,
                border: "none", borderRadius: 1,
                background: added ? "#22c55e" : "#dc2626",
                color: "#fff",
                fontWeight: 700, fontSize: "0.95rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 1,
                cursor: "pointer",
                transition: "all .2s",
                "&:hover": { opacity: 0.9 },
              }}
            >
              {added ? <CheckCircle fontSize="small" /> : <ShoppingCart fontSize="small" />}
              {added ? "Added!" : "BUY NOW"}
            </Box>

            <Tooltip title={wished ? "Saved!" : "Save"}>
              <IconButton
                onClick={() => setWished(!wished)}
                sx={{
                  border: "2px solid #ddd", borderRadius: 1, color: wished ? "#dc2626" : "#999",
                  transition: "all .2s",
                  "&:hover": { borderColor: "#dc2626", color: "#dc2626" },
                }}
              >
                {wished ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Share">
              <IconButton sx={{
                border: "2px solid #ddd", borderRadius: 1, color: "#999",
                "&:hover": { borderColor: "#333", color: "#333" },
              }}>
                <Share />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Delivery note */}
          <Box sx={{
            display: "flex", alignItems: "center", gap: 1.5,
            background: "#f0fdf4", borderRadius: 1, p: 1.5, mt: 2,
            border: "1px solid #bbf7d0",
          }}>
            <LocalShipping sx={{ color: "#22c55e", fontSize: 20 }} />
            <Box sx={{ fontSize: 12, color: "#15803d", fontWeight: 500 }}>
              Free delivery island-wide · Usually ships within 1–2 business days
            </Box>
          </Box>
        </Box>
      </Box>

      {/* ── Specifications ── */}
      <Box
        sx={{
          maxWidth: 1200, mx: "auto", mt: 4,
          background: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box sx={{
          background: "#333",
          px: 4, py: 2,
        }}>
          <Box component="h2" sx={{
            m: 0, color: "#fff", fontSize: "1rem",
            fontWeight: 700, letterSpacing: 1, textTransform: "uppercase",
          }}>
            Specifications
          </Box>
          <Box sx={{ color: "#999", fontSize: 12, mt: 0.3 }}>
            Intel® Core™ i9-14900K Features
          </Box>
        </Box>

        {/* Grid */}
        <Box sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          p: { xs: 2, md: 3 },
          gap: 0,
        }}>
          {specs.map((spec, i) => (
            <Box
              key={spec.label}
              sx={{
                display: "flex",
                gap: 2,
                py: 1.2,
                px: 1,
                borderBottom: "1px solid #eee",
                background: i % 2 === 0 ? "#fafafa" : "#fff",
                "&:hover": { background: "#f5f5f5" },
                transition: "background .15s",
                alignItems: "flex-start",
              }}
            >
              <Box sx={{
                minWidth: 160, fontSize: 11, fontWeight: 600,
                color: "#666", textTransform: "uppercase", letterSpacing: 0.5,
              }}>
                {spec.label}
              </Box>
              <Box sx={{ fontSize: 13, color: "#333", fontWeight: 500 }}>
                {spec.value}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Font import */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');`}</style>
    </Box>
  );
}
