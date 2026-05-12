import dynamic from "next/dynamic";
import { type TimelineEvent } from "@/components/timeline/Timeline";
import familyData from "@/data/family.json";

const DynamicTimeline = dynamic(() => import("@/components/timeline/Timeline"), {
  loading: () => <div className="text-gold/50 animate-pulse text-center w-full py-32 uppercase tracking-widest text-sm">Resurrecting Era...</div>,
});

export default function TimelinePage() {
  // Transform familyData members with a dob into TimelineEvents
  const events: (TimelineEvent & { originalDate: string })[] = [];
  
  familyData.members.forEach((member: any) => {
    if (member.dob) {
      // Parse DD/MM/YYYY into a year for the big display
      const parts = member.dob.split('/');
      let year = member.dob;
      if (parts.length === 3) {
        year = parts[2];
      }
      
      events.push({
        year: year,
        originalDate: member.dob, // keep for sorting logic
        title: `Birth of ${member.name}`,
        description: member.bio || `${member.name} was born on ${member.dob}.`
      });
    }
  });

  if ((familyData.root as any).dob) {
     const rootParts = (familyData.root as any).dob.split('/');
     events.push({
       year: rootParts.length === 3 ? rootParts[2] : (familyData.root as any).dob,
       originalDate: (familyData.root as any).dob,
       title: `Birth of ${familyData.root.name}`,
       description: (familyData.root as any).bio || `${familyData.root.name} was born on ${(familyData.root as any).dob}.`
     });
  }

  // Sort events chronologically. The dates are DD/MM/YYYY.
  events.sort((a, b) => {
    const parseDate = (dString: string) => {
      const parts = dString.split('/');
      if (parts.length === 3) {
        // Create Date as YYYY-MM-DD
        return new Date(`${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`).getTime();
      }
      return new Date(dString).getTime() || 0;
    };
    return parseDate(a.originalDate) - parseDate(b.originalDate);
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-start py-12 md:py-24 bg-background overflow-hidden relative">
      <div className="w-full max-w-5xl text-center mb-4 md:mb-8 px-6 z-10">
        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-serif text-gold glow uppercase tracking-widest mb-3 md:mb-6">
          The Timeline
        </h1>
        <p className="max-w-sm md:max-w-2xl mx-auto text-sm md:text-lg text-foreground/70 leading-relaxed font-light">
          Trace the historical milestones and the legendary journey of our family&apos;s legacy across centuries.
        </p>
      </div>

      <DynamicTimeline events={events} />
    </div>
  );
}
