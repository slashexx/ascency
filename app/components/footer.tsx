import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-muted py-4 mt-8 border-t border-border">
      <div className="max-w-[1280px] mx-auto px-4 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
        <Link href="#" className="hover:text-foreground transition-colors">Terms</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Privacy</Link>
        <Link href="#" className="hover:text-foreground transition-colors">Security</Link>
        <Link href="#" className="hover:text-foreground transition-colors">GitHub Blog</Link>
        <Link href="#" className="hover:text-foreground transition-colors">About</Link>
      </div>
    </footer>
  );
}
