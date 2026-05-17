"use client";

import { useRef, useMemo, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import familyData from "@/data/family.json";
import SpaceBackground from "@/components/background/SpaceBackground";

// Helper to determine bracket label and sorting weight
function getGenerationInfo(year: number, customLabel?: string, customWeight?: number) {
  if (customLabel) return { label: customLabel, weight: customWeight! };
  const decade = Math.floor(year / 10) * 10;
  const rem = year % 10;
  if (rem <= 3) return { label: `Early ${decade}s`, weight: decade + 0 };
  if (rem <= 6) return { label: `Mid ${decade}s`, weight: decade + 4 };
  return { label: `Late ${decade}s`, weight: decade + 7 };
}

export default function FamilyPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Calculate ages, group by generation, and sort
  const generationGroups = useMemo(() => {
    const groupsMap = new Map<string, { label: string, weight: number, members: any[] }>();
    const unassigned: any[] = [];

    familyData.members.forEach((member: any) => {
      let age = null;
      let birthYear = null;
      let customLabel = null;
      let customWeight = 0;
      
      if (member.dob) {
        const dobStr = member.dob.toLowerCase();
        if (dobStr.includes('90s') || dobStr.includes('1900s')) {
          customLabel = member.dob;
          if (dobStr.includes('early')) customWeight = 1900;
          else if (dobStr.includes('mid')) customWeight = 1904;
          else customWeight = 1907;
          birthYear = customWeight;
        } else {
          const parts = member.dob.split("/");
          if (parts.length === 3) {
            birthYear = parseInt(parts[2], 10);
            const date = new Date(birthYear, parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
            const ageDifMs = Date.now() - date.getTime();
            if (ageDifMs > 0) {
              age = Math.abs(new Date(ageDifMs).getUTCFullYear() - 1970);
            }
          }
        }
      }

      const m = { ...member, age, birthYear };

      if (birthYear) {
        const { label, weight } = getGenerationInfo(birthYear, customLabel || undefined, customWeight);
        if (!groupsMap.has(label)) {
          groupsMap.set(label, { label, weight, members: [] });
        }
        groupsMap.get(label)!.members.push(m);
      } else {
        unassigned.push(m);
      }
    });

    // Convert map to array and sort groups chronologically (oldest first)
    const sortedGroups = Array.from(groupsMap.values()).sort((a, b) => a.weight - b.weight);

    // Sort members within each group: Men first, then Women. Then by Age.
    sortedGroups.forEach(group => {
      group.members.sort((a, b) => {
        // Gender sorting: Male first
        const genderA = (a.gender || "").toLowerCase();
        const genderB = (b.gender || "").toLowerCase();
        
        if (genderA === "male" && genderB !== "male") return -1;
        if (genderA !== "male" && genderB === "male") return 1;

        // If same gender, sort by age descending (oldest first)
        const ageA = a.age || 0;
        const ageB = b.age || 0;
        return ageB - ageA;
      });
    });

    if (unassigned.length > 0) {
      sortedGroups.push({ label: "Ancestors & Others", weight: 9999, members: unassigned });
    }

    return sortedGroups;
  }, []);

  return (
    <main ref={containerRef} className="flex min-h-screen flex-col items-center bg-black relative pb-32 overflow-hidden">
      <SpaceBackground />
      
      {/* Sticky Section Title */}
      <div className="sticky top-24 md:top-32 z-30 w-full text-center mb-10 md:mb-20 px-6 pt-4 pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block bg-[#050505]/80 backdrop-blur-xl border border-gold/20 px-8 py-4 rounded-full shadow-[0_0_40px_rgba(212,175,55,0.15)] pointer-events-auto"
        >
          <h1 className="text-2xl md:text-4xl font-serif text-gold gold-glow uppercase tracking-[0.2em] m-0">
            The Family
          </h1>
        </motion.div>
      </div>

      {/* Aligned Timeline Layout */}
      <div className="w-full max-w-4xl mx-auto px-6 relative z-10 flex flex-col gap-16 md:gap-24">
        
        {/* Timeline vertical line (Background) */}
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-px bg-gold/10 z-0" />
        
        {/* Animated Timeline line (Foreground) */}
        <motion.div 
          className="absolute left-8 md:left-12 top-0 w-[2px] bg-gold origin-top shadow-[0_0_15px_rgba(212,175,55,1)] z-0" 
          style={{ height: lineHeight }} 
        />

        {generationGroups.map((group, groupIndex) => (
          <div key={group.label} className="relative z-10 flex flex-col gap-10 md:gap-14">
            
            {/* Generation Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="sticky top-48 md:top-56 z-30 flex justify-start pl-16 md:pl-24 pointer-events-none"
            >
              <div className="bg-[#0a0a0a]/90 backdrop-blur-xl border border-gold/40 px-6 py-2 rounded-full shadow-[0_0_20px_rgba(212,175,55,0.2)]">
                <span className="text-sm md:text-base font-medium text-gold uppercase tracking-[0.3em] gold-glow">
                  {group.label}
                </span>
              </div>
            </motion.div>

            {/* Members in Generation */}
            <div className="flex flex-col gap-8 w-full pl-16 md:pl-24">
              {group.members.map((member, index) => {
                const isExpanded = expandedId === member.id;
                
                return (
                  <div key={member.id} className="relative w-full">
                    
                    {/* Timeline Node Dot */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true, margin: "-100px" }}
                      className="absolute -left-[40px] md:-left-[56px] top-8 w-4 h-4 md:w-5 md:h-5 bg-[#030303] border-2 border-gold rounded-full -translate-x-1/2 shadow-[0_0_15px_rgba(212,175,55,0.8)] md:shadow-[0_0_20px_rgba(212,175,55,1)] z-20"
                    />

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6 }}
                      className="w-full"
                    >
                      {/* Card */}
                      <div 
                        className={`
                          relative w-full rounded-3xl p-6 md:p-8 cursor-pointer transition-all duration-500 flex flex-col justify-between
                          ${isExpanded 
                            ? "bg-[#0a0a0a]/95 border-gold/50 shadow-[0_0_40px_rgba(212,175,55,0.2)]" 
                            : "bg-[#050505]/80 border-white/10 hover:border-gold/30 hover:bg-[#0a0a0a]/90 shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
                          }
                          backdrop-blur-xl border 
                        `}
                        onClick={() => setExpandedId(isExpanded ? null : member.id)}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-700 rounded-3xl pointer-events-none" />

                        <div className="flex flex-col items-start gap-6 relative z-10 w-full h-full justify-between">
                          
                          {/* Core Info */}
                          <div className="w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                              <h2 className="text-2xl font-serif text-white tracking-wide leading-tight">
                                {member.name}
                              </h2>
                              
                              <div className="flex items-center gap-3 shrink-0">
                                {/* Initial Avatar inline for compact beautiful look */}
                                <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center bg-black/50 shadow-inner">
                                  <span className="text-sm font-serif text-gold gold-glow">
                                    {member.name.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                {member.age !== null && (
                                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-[10px] font-semibold tracking-widest uppercase">
                                    <span>{member.age} Yrs</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-4">
                              {member.gender && (
                                <span className="text-[10px] text-foreground/50 uppercase tracking-[0.2em]">{member.gender}</span>
                              )}
                              {member.parent && (
                                <>
                                  <span className="text-white/20">•</span>
                                  <span className="text-[10px] text-foreground/50 uppercase tracking-[0.2em]">
                                    Child of {member.parent.charAt(0).toUpperCase() + member.parent.slice(1)}
                                  </span>
                                </>
                              )}
                              {member.spouse && (
                                <>
                                  <span className="text-white/20">•</span>
                                  <span className="text-[10px] text-gold/70 uppercase tracking-[0.2em]">
                                    Spouse: {member.spouse.charAt(0).toUpperCase() + member.spouse.slice(1)}
                                  </span>
                                </>
                              )}
                            </div>

                            {/* Short Intro */}
                            {member.bio && (
                              <p className={`text-sm md:text-base text-foreground/70 font-light leading-relaxed italic ${!isExpanded && "line-clamp-2"}`}>
                                "{member.bio}"
                              </p>
                            )}

                            {/* Expandable Section */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-6 mt-6 border-t border-white/10 space-y-5">
                                    {member.dob && (
                                      <div className="flex flex-col">
                                        <span className="text-[10px] text-gold/60 uppercase tracking-[0.2em] mb-1">Date of Birth</span>
                                        <span className="text-sm text-foreground/90 font-light tracking-wide">{member.dob}</span>
                                      </div>
                                    )}
                                    
                                    {member.children && member.children.length > 0 && (
                                      <div className="flex flex-col">
                                        <span className="text-[10px] text-gold/60 uppercase tracking-[0.2em] mb-2">Descendants</span>
                                        <div className="flex flex-wrap gap-2">
                                          {member.children.map((child: string) => (
                                            <span key={child} className="px-3 py-1 rounded-full border border-gold/20 bg-gold/5 text-xs text-gold/90 capitalize tracking-wide">
                                              {child}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Expand Indicator */}
                          <div className="mt-6 flex items-center gap-2 text-[10px] text-gold/40 uppercase tracking-[0.2em] group-hover:text-gold transition-colors">
                            {isExpanded ? "Show Less" : "Explore Details"}
                            <motion.div
                              animate={{ rotate: isExpanded ? 180 : 0 }}
                              className="w-3 h-3 flex items-center justify-center"
                            >
                              ▼
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
