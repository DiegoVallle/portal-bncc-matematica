import Image from "next/image";
import Link from "next/link";

export default function AppHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
        <Link href="/" aria-label="ValeEdu Matemática — início" className="flex items-center gap-3 rounded-lg">
          <Image src="/logo-valeedu.png" alt="" width={52} height={52} priority />
          <span className="flex flex-col">
            <span className="text-2xl font-bold tracking-tight text-valeedu-blue">Vale<span className="text-valeedu-green">Edu</span></span>
            <span className="text-xs font-medium tracking-widest text-slate-500">MATEMÁTICA</span>
          </span>
        </Link>
        <p className="hidden text-sm text-slate-500 sm:block">Aprender. Praticar. Evoluir.</p>
      </div>
    </header>
  );
}
