"use client";

// Client shim so the server root layout can mount the WebGL backdrop.
// three.js is loaded client-side only.

import dynamic from "next/dynamic";

const Background3D = dynamic(() => import("./Background3D"), { ssr: false });

export default function Background3DMount() {
  return <Background3D />;
}
