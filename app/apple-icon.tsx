import { ImageResponse } from "next/og";

/**
 * Apple touch icon. Generated rather than shipped as a binary because
 * `apple-icon` accepts only .jpg/.jpeg/.png — SVG isn't allowed — and this keeps
 * it in step with app/icon.svg without a second file to hand-edit.
 *
 * Apple applies its own rounded-corner mask, so this draws a full-bleed square.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#2E22E5",
        }}
      >
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: "50%",
            background: "#F5F5F4",
          }}
        />
      </div>
    ),
    size,
  );
}
