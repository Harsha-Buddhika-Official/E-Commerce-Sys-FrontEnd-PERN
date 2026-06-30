import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import TagOutlinedIcon from "@mui/icons-material/TagOutlined";

import { SORA, INTER } from "../../../../styles/fonts";

export default function AttributeCard({ attribute, onDeleteAttribute, onAddValue, onDeleteValue }) {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden flex flex-col"
      style={{ border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      {/* Card header */}
      <div className="px-4 sm:px-5 py-4" style={{ borderBottom: "1px solid #f5f5f5" }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0" style={{ backgroundColor: "#111" }}>
            <TagOutlinedIcon style={{ fontSize: 20, color: "#fff" }} />
          </div>
          <div className="min-w-0">
            <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111" }} className="truncate">{attribute.name}</p>
            <p style={{ ...INTER, fontSize: 11, color: "#bbb" }}>
              {attribute.values.length} value{attribute.values.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="px-4 sm:px-5 py-4 flex-1">
        {attribute.values.length === 0 ? (
          <button
            onClick={() => onAddValue(attribute)}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl cursor-pointer transition-all"
            style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#bbb", border: "1.5px dashed #e5e5e5", backgroundColor: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#111"; e.currentTarget.style.color = "#111"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e5e5"; e.currentTarget.style.color = "#bbb"; }}
          >
            <AddOutlinedIcon style={{ fontSize: 15 }} /> Add first value
          </button>
        ) : (
          <div className="flex flex-wrap gap-2">
            {attribute.values.map((val) => (
              <div
                key={val.attribute_value_id}
                className="group flex items-center gap-1.5 pl-3 pr-1.5 py-1.5 rounded-full transition-all max-w-full"
                style={{ backgroundColor: "#f5f5f5", border: "1px solid #ebebeb" }}
              >
                <span style={{ ...INTER, fontSize: 12, fontWeight: 600, color: "#333" }} className="truncate max-w-[160px] sm:max-w-none">
                  {val.value}
                </span>
                <button
                  onClick={() => onDeleteValue(attribute, val)}
                  className="flex items-center justify-center w-4 h-4 rounded-full cursor-pointer border-none transition-all shrink-0"
                  style={{ backgroundColor: "transparent", color: "#ccc" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#fee2e2"; e.currentTarget.style.color = "#e53935"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#ccc"; }}
                >
                  <CloseIcon style={{ fontSize: 11 }} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with action buttons */}
      <div className="flex items-center gap-2 px-4 sm:px-5 py-4" style={{ borderTop: "1px solid #f5f5f5", backgroundColor: "#fafafa" }}>
        <button
          onClick={() => onAddValue(attribute)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg cursor-pointer transition-all"
          style={{ ...INTER, fontSize: 12, fontWeight: 600, backgroundColor: "#f5f5f5", color: "#111", border: "1px solid #ebebeb" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#ebebeb"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f5f5f5"}
        >
          <AddOutlinedIcon style={{ fontSize: 14 }} />
          Add Value
        </button>
        <button
          onClick={() => onDeleteAttribute(attribute)}
          className="flex items-center justify-center w-10 h-10 rounded-lg cursor-pointer transition-all shrink-0"
          style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#e53935" }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fee2e2"}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#fef2f2"}
        >
          <DeleteOutlineOutlinedIcon style={{ fontSize: 16 }} />
        </button>
      </div>
    </div>
  );
}