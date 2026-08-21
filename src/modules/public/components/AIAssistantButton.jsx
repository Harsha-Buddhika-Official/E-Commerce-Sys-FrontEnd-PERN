// src/modules/public/components/AIAssistantButton.jsx
import { Link } from "react-router-dom";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";

export default function AIAssistantButton() {
  return (
    <Link
      to="/chat"
      className="
        fixed bottom-22 right-6 z-40
        flex items-center gap-2
        rounded-full
        bg-red-600 text-white
        px-5 py-3
        shadow-lg
        border border-red-500
        transition-all duration-200
        hover:bg-red-700
        hover:border-red-600
        hover:scale-105
        active:scale-95
      "
      aria-label="Ask AI Assistant"
    >
      <SmartToyOutlinedIcon fontSize="small" />

      <span className="text-sm font-medium whitespace-nowrap">
        Ask AI
      </span>
    </Link>
  );
}