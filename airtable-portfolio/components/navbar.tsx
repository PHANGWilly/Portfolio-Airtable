import { Menubar, MenubarMenu, MenubarTrigger } from "./ui/menubar";
import Link from "next/link";

export default function Navbar() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <Link href="/about">About</Link>
        </MenubarTrigger>
        <MenubarTrigger>
          <Link href="/projects">Projects</Link>
        </MenubarTrigger>
        <MenubarTrigger>
          <Link href="/contact">Contact</Link>
        </MenubarTrigger>
        <MenubarTrigger>
          <Link href="/login">Sign in</Link>
        </MenubarTrigger>
        <MenubarTrigger>
          <Link href="/register">Sign up</Link>
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}
