import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const pathname = usePathname();

  return (
    <aside className="w-52 h-screen bg-gray-100 px-6 py-6 border-r">
      <h2 className="text-xl font-bold mb-6 text-gray-700">Espace Admin</h2>
      <nav className="flex flex-col gap-4 text-sm">
        <Link
          href="/admin/projects"
          className={`hover:underline ${pathname === "/admin/projects" ? "font-bold text-blue-600" : "text-gray-700"}`}
        >
          Projets
        </Link>
        <Link
          href="/admin/students"
          className={`hover:underline ${pathname === "/admin/students" ? "font-bold text-blue-600" : "text-gray-700"}`}
        >
          Étudiants
        </Link>
        <Link
          href="/admin/subjects"
          className={`hover:underline ${pathname === "/admin/subjects" ? "font-bold text-blue-600" : "text-gray-700"}`}
        >
          Matières
        </Link>
      </nav>
    </aside>
  );
}
