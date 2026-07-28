// Generates public/media/img/grain.png — the film-grain tile laid over the
// footer at `mix-blend-overlay`.
//
// Written out as a script rather than shipped as a binary so the texture has a
// clear provenance and can be re-tuned. Pure per-pixel noise tiles seamlessly by
// construction: there's no structure to mismatch across the edges.
//
// Run `pnpm generate:grain` after changing anything below.

import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

const SIZE = 256;
/** Distance either side of mid-grey. Higher = coarser grain. */
const AMPLITUDE = 24;
/** Quantisation step. Fewer distinct values compress much better. */
const STEP = 3;
/** Fixed seed so regenerating produces an identical file. */
const SEED = 0x9e3779b9;

/* ------------------------------- noise ---------------------------------- */

// Mulberry32 — small, fast, deterministic.
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(SEED);

// One filter byte (0 = None) per scanline, then SIZE grey samples.
const raw = Buffer.alloc(SIZE * (SIZE + 1));
for (let y = 0; y < SIZE; y++) {
  const rowStart = y * (SIZE + 1);
  raw[rowStart] = 0;
  for (let x = 0; x < SIZE; x++) {
    const offset = (rand() * 2 - 1) * AMPLITUDE;
    const quantised = Math.round(offset / STEP) * STEP;
    raw[rowStart + 1 + x] = Math.max(0, Math.min(255, 128 + quantised));
  }
}

/* -------------------------------- PNG ----------------------------------- */

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([length, body, crc]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(SIZE, 0); // width
ihdr.writeUInt32BE(SIZE, 4); // height
ihdr[8] = 8; // bit depth
ihdr[9] = 0; // colour type 0 = greyscale
ihdr[10] = 0; // deflate
ihdr[11] = 0; // adaptive filtering
ihdr[12] = 0; // no interlace

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk("IHDR", ihdr),
  chunk("IDAT", deflateSync(raw, { level: 9 })),
  chunk("IEND", Buffer.alloc(0)),
]);

const out = new URL("../public/media/img/grain.png", import.meta.url);
writeFileSync(out, png);

console.log(
  `public/media/img/grain.png: ${SIZE}x${SIZE}, ${(png.length / 1024).toFixed(1)}KB`,
);
