"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeMouseHandler,
  BackgroundVariant,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";

// Custom node with glassmorphism, mobile-optimized sizing
function FamilyNode({ data }: { data: any }) {
  return (
    <div className="
      relative px-4 py-3 md:px-8 md:py-5 
      rounded-xl md:rounded-2xl 
      border border-gold/30 
      shadow-[0_0_20px_rgba(212,175,55,0.15)] 
      bg-black/60 backdrop-blur-xl 
      text-center 
      min-w-[140px] md:min-w-[200px] 
      transition-all 
      hover:border-gold/80 
      cursor-pointer 
      pulse-gold
    ">
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 md:!w-3 md:!h-3 !bg-gold !border-none !-top-[4px] md:!-top-[6px] shadow-[0_0_10px_rgba(212,175,55,1)]" />
      
      <h3 className="font-serif text-gold uppercase tracking-wider md:tracking-widest text-xs md:text-base glow leading-tight">{data.name}</h3>
      {data.spouse && <p className="text-[9px] md:text-[11px] text-foreground/50 uppercase tracking-wider md:tracking-widest mt-1 md:mt-2 font-medium break-words">m. {data.spouse}</p>}
      
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 md:!w-3 md:!h-3 !bg-gold !border-none !-bottom-[4px] md:!-bottom-[6px] shadow-[0_0_10px_rgba(212,175,55,1)]" />
    </div>
  );
}

export default function InteractiveTree({ initialNodes, initialEdges }: { initialNodes: Node[], initialEdges: Edge[] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const nodeTypes = useMemo(() => ({ familyNode: FamilyNode }), []);

  // Re-sync if props somehow change
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="h-[60vh] md:h-[75vh] w-full border border-gold/10 rounded-xl md:rounded-2xl relative overflow-hidden bg-[#030303] shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        colorMode="dark"
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Controls 
          className="!bg-[#030303] border !border-gold/20 fill-gold z-10 shadow-[0_0_20px_rgba(212,175,55,0.1)]" 
          position="bottom-right"
          showInteractive={false}
        />
        <Background variant={BackgroundVariant.Dots} color="rgba(212, 175, 55, 0.15)" gap={30} size={2} />
      </ReactFlow>

      {/* Modal Overlay — iOS-style sheet on mobile */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4"
            onClick={() => setSelectedNode(null)}
          >
            <motion.div
               initial={{ y: 200, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               exit={{ y: 200, opacity: 0 }}
               transition={{ type: "spring", damping: 25, stiffness: 300 }}
               onClick={(e) => e.stopPropagation()}
               className="
                 bg-[#0a0a0a] border border-gold/30
                 rounded-t-3xl md:rounded-2xl 
                 p-8 md:p-10 
                 w-full md:max-w-sm 
                 shadow-[0_-8px_40px_rgba(0,0,0,0.6),0_0_60px_rgba(212,175,55,0.15)] 
                 text-center relative
               "
            >
              {/* iOS-style drag handle on mobile */}
              <div className="md:hidden w-10 h-1 bg-foreground/20 rounded-full mx-auto mb-6" />

              <button
                 onClick={() => setSelectedNode(null)}
                 className="absolute top-4 right-5 text-foreground/40 hover:text-gold transition-colors text-2xl font-light"
                 aria-label="Close"
              >
                 ✕
              </button>
              
              <h2 className="text-2xl md:text-3xl font-serif text-gold uppercase tracking-widest mb-4 md:mb-6 glow">
                 {selectedNode.data.name as string}
              </h2>

              <div className="flex flex-col gap-3 md:gap-4 text-left border-y border-gold/10 py-4 md:py-6 mb-6 md:mb-8">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-1">Spouse</p>
                  <p className="text-sm uppercase tracking-widest text-foreground/90">
                    {selectedNode.data.spouse ? (selectedNode.data.spouse as string) : "None"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-gold/60 mb-1">Descendants</p>
                  <p className="text-sm uppercase tracking-widest text-foreground/90">
                    {selectedNode.data.children && (selectedNode.data.children as string[]).length > 0 
                      ? `${(selectedNode.data.children as string[]).length} Known Descendant(s)`
                      : "None documented"}
                  </p>
                </div>
              </div>

              <button
                 onClick={() => setSelectedNode(null)}
                 className="
                   w-full md:w-auto
                   px-8 py-3.5 md:py-3
                   border border-gold/30 text-gold 
                   hover:bg-gold/10 
                   rounded-full 
                   transition-all uppercase tracking-widest text-[11px] 
                   hover:shadow-[0_0_15px_rgba(212,175,55,0.2)]
                   active:scale-95
                 "
              >
                 Close Archive
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
