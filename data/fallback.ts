import { Node, Edge } from "@xyflow/react";

export const fallbackTimelineEvents = [
  {
    year: "1892",
    title: "The Founding Father",
    description: "The visionary patriarch established the first trading empire that laid the foundation for generations to come.",
  },
  {
    year: "1924",
    title: "The Golden Era",
    description: "Expansion across borders brought unprecedented wealth, transforming the humble business into a trans-continental powerhouse.",
  },
  {
    year: "1956",
    title: "The Legacy Estate",
    description: "The grand ancestral mansion was completed, becoming the central gathering place for the Khandaan's most secretive meetings.",
  },
  {
    year: "1988",
    title: "The Silent Trust",
    description: "A profound transition. The family consolidated its power away from public view, building a lasting dynasty.",
  },
  {
    year: "2026",
    title: "The Modern Renaissance",
    description: "A new era of the khandaan begins, blending deep-rooted tradition with modern influence and infinite prosperity.",
  },
];

export const fallbackGalleryImages = [
  { id: "1", src: "/gallery/1.png", alt: "Golden Vintage Pocket Watch", caption: "The Ancestral Timepiece" },
  { id: "2", src: "/gallery/2.png", alt: "Vintage handwritten letter", caption: "The First Correspondence" },
  { id: "3", src: "/gallery/3.png", alt: "Old vintage mansion", caption: "The Earliest Estate" },
  { id: "4", src: "/gallery/4.png", alt: "Royal family crest", caption: "The Legacy Crest" },
];

export const fallbackTreeNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: { label: "The Patriarch" },
    style: {
      background: "#0b0b0b",
      color: "#d4af37",
      border: "1px solid #d4af37",
      borderRadius: "8px",
      padding: "15px",
      boxShadow: "0 0 15px rgba(212, 175, 55, 0.4)",
      fontFamily: "serif",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      minWidth: "200px",
      textAlign: "center" as const,
    },
  },
  {
    id: "2",
    position: { x: -200, y: 150 },
    data: { label: "First Son" },
    style: {
      background: "#0b0b0b",
      color: "#fff",
      border: "1px solid rgba(212, 175, 55, 0.4)",
      borderRadius: "8px",
      padding: "15px",
      minWidth: "150px",
      textAlign: "center" as const,
    },
  },
  {
    id: "3",
    position: { x: 200, y: 150 },
    data: { label: "Second Son" },
    style: {
      background: "#0b0b0b",
      color: "#fff",
      border: "1px solid rgba(212, 175, 55, 0.4)",
      borderRadius: "8px",
      padding: "15px",
      minWidth: "150px",
      textAlign: "center" as const,
    },
  },
  {
    id: "4",
    position: { x: -300, y: 300 },
    data: { label: "Grandson A" },
    style: {
      background: "#0b0b0b",
      color: "#ccc",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "8px",
      padding: "10px",
      textAlign: "center" as const,
    },
  },
  {
    id: "5",
    position: { x: -100, y: 300 },
    data: { label: "Granddaughter B" },
    style: {
      background: "#0b0b0b",
      color: "#ccc",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      borderRadius: "8px",
      padding: "10px",
      textAlign: "center" as const,
    },
  },
];

export const fallbackTreeEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#d4af37" } },
  { id: "e1-3", source: "1", target: "3", animated: true, style: { stroke: "#d4af37" } },
  { id: "e2-4", source: "2", target: "4", animated: false, style: { stroke: "#666" } },
  { id: "e2-5", source: "2", target: "5", animated: false, style: { stroke: "#666" } },
];
