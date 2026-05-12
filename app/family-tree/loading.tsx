export default function Loading() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-8 bg-background">
      <div className="w-16 h-16 rounded-full border-t-2 border-r-2 border-gold animate-spin mb-6" />
      <p className="text-gold uppercase tracking-widest text-sm animate-pulse glow">Rendering Heritage...</p>
    </div>
  );
}
