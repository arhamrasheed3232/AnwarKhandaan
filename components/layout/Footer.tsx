export default function Footer() {
  return (
    <footer className="w-full py-6 md:py-8 text-center text-[10px] md:text-sm text-foreground/50 border-t border-foreground/10 bg-background/80 mb-16 md:mb-0">
      <p className="uppercase tracking-wider md:tracking-normal">&copy; {new Date().getFullYear()} The Khandaan Legacy. All rights reserved.</p>
    </footer>
  );
}
