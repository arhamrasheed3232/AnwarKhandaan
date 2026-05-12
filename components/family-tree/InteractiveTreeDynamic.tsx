"use client";
import dynamic from "next/dynamic";

const InteractiveTree = dynamic(() => import("./InteractiveTree"), {
  ssr: false, // Ensures React Flow renders safely on client preventing hydration mismatches
});

export default InteractiveTree;
