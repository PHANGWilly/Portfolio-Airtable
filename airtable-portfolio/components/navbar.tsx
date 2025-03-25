import { Menubar, MenubarMenu, MenubarTrigger } from "./ui/menubar";
import Link from "next/link";

export default function Navbar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <Link href="/about">A propos</Link>
        </MenubarTrigger>
        <MenubarTrigger>
          <Link href="/projects">Projets</Link>
        </MenubarTrigger>
        <MenubarTrigger>
          <Link href="/contact">Contact</Link>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
