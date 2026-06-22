import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOrderReceipt } from "../../features/orders/hooks/useOrderReceipt";
import ArrowBackOutlinedIcon       from "@mui/icons-material/ArrowBackOutlined";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import DownloadOutlinedIcon        from "@mui/icons-material/DownloadOutlined";
import ZoomInOutlinedIcon          from "@mui/icons-material/ZoomInOutlined";
import ZoomOutOutlinedIcon         from "@mui/icons-material/ZoomOutOutlined";
import { SORA, INTER }             from "../../../../styles/fonts";

const isPdfUrl = (url) => typeof url === "string" && url.toLowerCase().endsWith(".pdf");

const OrderReceiptPage = () => {
    const { id: orderId } = useParams();
    const navigate        = useNavigate();
    const { receipt, loading, error, fetchReceipt } = useOrderReceipt();
    const [zoom, setZoom] = useState(1);

    useEffect(() => {
        if (orderId) fetchReceipt(orderId);
    }, [orderId, fetchReceipt]);

    const isPdf      = isPdfUrl(receipt?.media_url);
    const canZoomIn  = zoom < 3;
    const canZoomOut = zoom > 0.5;

    const handleDownload = () => {
        if (!receipt?.media_url) return;
        const a   = document.createElement("a");
        a.href    = receipt.media_url.replace("/image/upload/", "/raw/upload/");
        a.download = `receipt-order-${orderId}`;
        a.target  = "_blank";
        a.click();
    };

    return (
        <div className="h-full overflow-y-auto bg-[#f5f5f5]" style={{ minHeight: "100vh" }}>
            <div className="flex flex-col items-center justify-start p-6 gap-5" style={{ minHeight: "100vh" }}>

                {/* ── Controls bar ── */}
                {!loading && !error && receipt?.media_url && (
                    <div className="flex items-center justify-between w-full gap-3 flex-wrap" style={{ maxWidth: 860 }}>

                        {/* Back */}
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
                            style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#fff", color: "#555", border: "1px solid #e5e5e5" }}
                            onMouseEnter={(e) => e.currentTarget.style.borderColor = "#111"}
                            onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e5e5e5"}
                        >
                            <ArrowBackOutlinedIcon style={{ fontSize: 15 }} /> Back
                        </button>

                        {/* Zoom — images only */}
                        {!isPdf && (
                            <div
                                className="flex items-center gap-1 px-2 py-1 rounded-xl"
                                style={{ backgroundColor: "#fff", border: "1px solid #e5e5e5" }}
                            >
                                <button
                                    onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
                                    disabled={!canZoomOut}
                                    className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer transition-all disabled:opacity-30"
                                    style={{ backgroundColor: "transparent", border: "none", color: "#555" }}
                                >
                                    <ZoomOutOutlinedIcon style={{ fontSize: 16 }} />
                                </button>
                                <span style={{ ...INTER, fontSize: 12, fontWeight: 700, color: "#888", minWidth: 40, textAlign: "center" }}>
                                    {Math.round(zoom * 100)}%
                                </span>
                                <button
                                    onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
                                    disabled={!canZoomIn}
                                    className="flex items-center justify-center w-7 h-7 rounded-lg cursor-pointer transition-all disabled:opacity-30"
                                    style={{ backgroundColor: "transparent", border: "none", color: "#555" }}
                                >
                                    <ZoomInOutlinedIcon style={{ fontSize: 16 }} />
                                </button>
                            </div>
                        )}

                        {/* Download */}
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
                            style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#333"}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#111"}
                        >
                            <DownloadOutlinedIcon style={{ fontSize: 15 }} /> Download
                        </button>
                    </div>
                )}

                {/* ── Loading ── */}
                {loading && (
                    <div className="flex items-center gap-3 mt-20">
                        <div className="w-5 h-5 border-2 border-gray-200 border-t-gray-600 rounded-full animate-spin" />
                        <p style={{ ...INTER, fontSize: 13, color: "#888" }}>Loading receipt…</p>
                    </div>
                )}

                {/* ── Error ── */}
                {!loading && error && (
                    <div
                        className="mt-20 px-6 py-5 rounded-2xl text-center"
                        style={{ backgroundColor: "#fff", border: "1px solid #ebebeb", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", maxWidth: 360 }}
                    >
                        <InsertDriveFileOutlinedIcon style={{ fontSize: 36, color: "#e53935", marginBottom: 8 }} />
                        <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111", margin: "0 0 6px" }}>
                            Failed to load receipt
                        </p>
                        <p style={{ ...INTER, fontSize: 12, color: "#888", margin: 0 }}>
                            The receipt could not be loaded. Please go back and try again.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 rounded-xl cursor-pointer"
                            style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
                        >
                            Go Back
                        </button>
                    </div>
                )}

                {/* ── No receipt ── */}
                {!loading && !error && !receipt?.media_url && (
                    <div
                        className="mt-20 px-6 py-8 rounded-2xl text-center"
                        style={{ backgroundColor: "#fff", border: "1px dashed #e5e5e5", maxWidth: 360 }}
                    >
                        <InsertDriveFileOutlinedIcon style={{ fontSize: 40, color: "#ccc", marginBottom: 8 }} />
                        <p style={{ ...SORA, fontSize: 14, fontWeight: 800, color: "#111", margin: "0 0 6px" }}>
                            No receipt uploaded
                        </p>
                        <p style={{ ...INTER, fontSize: 12, color: "#aaa", margin: 0 }}>
                            The customer hasn't uploaded a payment receipt yet.
                        </p>
                        <button
                            onClick={() => navigate(-1)}
                            className="mt-4 px-4 py-2 rounded-xl cursor-pointer"
                            style={{ ...INTER, fontSize: 12, fontWeight: 700, backgroundColor: "#111", color: "#fff", border: "none" }}
                        >
                            Go Back
                        </button>
                    </div>
                )}

                {/* ── Image receipt ── */}
                {!loading && !error && receipt?.media_url && !isPdf && (
                    <div
                        className="w-full rounded-2xl overflow-auto"
                        style={{
                            maxWidth:     860,
                            backgroundColor: "#fff",
                            border:       "1px solid #ebebeb",
                            boxShadow:    "0 2px 12px rgba(0,0,0,0.05)",
                        }}
                    >
                        <img
                            src={receipt.media_url}
                            alt="Payment receipt"
                            style={{
                                display:         "block",
                                width:           "100%",
                                transform:       `scale(${zoom})`,
                                transformOrigin: "top left",
                                transition:      "transform 0.2s ease",
                            }}
                        />
                    </div>
                )}

                {/* ── PDF receipt ── */}
                {!loading && !error && receipt?.media_url && isPdf && (
                    <div
                        className="w-full rounded-2xl overflow-hidden"
                        style={{
                            maxWidth:  860,
                            border:    "1px solid #ebebeb",
                            boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
                        }}
                    >
                        <iframe
                            src={receipt.media_url.replace("/image/upload/", "/raw/upload/")}
                            title="Payment Receipt PDF"
                            style={{
                                width:           "100%",
                                height:          "88vh",
                                border:          "none",
                                display:         "block",
                                backgroundColor: "#fff",
                            }}
                        />
                    </div>
                )}

            </div>
        </div>
    );
};

export default OrderReceiptPage;