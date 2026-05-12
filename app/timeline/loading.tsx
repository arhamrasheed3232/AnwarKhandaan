export default function Loading() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-8 bg-background">
      <div className="w-[2px] h-32 bg-gradient-to-b from-gold to-transparent animate-pulse mb-8" />
      <p className="text-gold uppercase tracking-widest text-sm animate-pulse glow">Unrolling Historical Timeline...</p>
    </div>
  );
}
