import { ImageResponse } from "next/og";

export const alt = "Ayush Aryal – Software builder, Hetauda, Nepal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, background: "#dfe4ec", color: "#0c1220" }}>
        <div style={{ fontSize: 30, letterSpacing: 8, color: "#3b465a" }}>AYUSH ARYAL · HETAUDA, NEPAL</div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05, marginTop: 24 }}>I build software</div>
        <div style={{ fontSize: 96, fontWeight: 700, lineHeight: 1.05, color: "#153a8c" }}>businesses run on.</div>
      </div>
    ),
    size,
  );
}
