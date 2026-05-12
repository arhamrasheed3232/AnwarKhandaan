import InteractiveTree from "@/components/family-tree/InteractiveTreeDynamic";
import familyData from "@/data/family.json";
import dagre from "dagre";

export default async function FamilyTreePage() {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // A standard family tree is directed top-down. 
  // We make it "far faar" by increasing the node separation and rank separation.
  const nodeWidth = 300;
  const nodeHeight = 150;
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 150, ranksep: 250 });

  const rawNodes: any[] = [];
  const rawEdges: any[] = [];

  // Look up spouse name Helper
  const getSpouseName = (spouseId: string) => {
    if (!spouseId) return null;
    const spouse = familyData.members.find((m: any) => m.id === spouseId);
    return spouse ? spouse.name : spouseId;
  };

  // 1. Root node
  rawNodes.push({
    id: familyData.root.id,
    type: "familyNode",
    data: { 
      name: familyData.root.name,
      spouse: getSpouseName(familyData.root.spouse),
      children: familyData.root.children
    }
  });
  dagreGraph.setNode(familyData.root.id, { width: nodeWidth, height: nodeHeight });

  // 2. Members (Filter out spouses without parents so they don't float)
  const treeMembers = familyData.members.filter((m: any) => m.parent);
  
  treeMembers.forEach((member: any) => {
    rawNodes.push({
      id: member.id,
      type: "familyNode",
      data: { 
        name: member.name,
        spouse: getSpouseName(member.spouse),
        children: member.children
      }
    });
    dagreGraph.setNode(member.id, { width: nodeWidth, height: nodeHeight });
  });

  // 3. Root -> children
  familyData.root.children.forEach((child: string) => {
    rawEdges.push({
      id: `e-${familyData.root.id}-${child}`,
      source: familyData.root.id,
      target: child,
      animated: true,
      style: { stroke: "#d4af37", strokeWidth: 2 }
    });
    dagreGraph.setEdge(familyData.root.id, child);
  });

  // 4. Members -> children
  treeMembers.forEach((member: any) => {
    if (member.children) {
      member.children.forEach((child: string) => {
        rawEdges.push({
          id: `e-${member.id}-${child}`,
          source: member.id,
          target: child,
          animated: true,
          style: { stroke: "#d4af37", strokeWidth: 2 }
        });
        dagreGraph.setEdge(member.id, child);
      });
    }
  });

  // Calculate Layout
  dagre.layout(dagreGraph);

  // Apply positions back to nodes
  const finalNodes = rawNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });
  const finalEdges = rawEdges;

  return (
    <div className="flex min-h-screen flex-col items-center justify-start px-4 md:p-8 pt-6 md:pt-12 text-center bg-background">
      <div className="w-full max-w-6xl mb-4 md:mb-8 z-10">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-serif text-gold glow uppercase tracking-widest mb-2 md:mb-4">
          Family Tree
        </h1>
        <p className="max-w-sm md:max-w-2xl mx-auto text-sm md:text-lg text-foreground/70 leading-relaxed font-light px-2">
          Explore the lineage and heritage of our ancestors. 
          <span className="hidden md:inline"> Use your mouse or touch to pan and zoom. Tap on any portrait card to read their historical legacy.</span>
          <span className="md:hidden"> Pinch to zoom, drag to explore.</span>
        </p>
      </div>

      <div className="w-full max-w-7xl flex-grow mb-4 md:mb-12">
        <InteractiveTree initialNodes={finalNodes} initialEdges={finalEdges} />
      </div>
    </div>
  );
}
