"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <div className="w-full top-0 sticky border-b border-b-slate-100 backdrop-blur-md bg-white/80 dark:bg-black/80 z-50">
      <div className="mx-auto max-w-7xl flex flex-row justify-between items-center px-4 py-2">
        {/* MENU GAUCHE */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Home</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* MENU CENTRE */}
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link href="/subjects" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Subjects</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Link href="/projects" legacyBehavior passHref>
                <NavigationMenuLink className={navigationMenuTriggerStyle()}>Projects</NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* MENU DROITE */}
        <NavigationMenu>
          <NavigationMenuList>
            {isLoggedIn ? (
              <>
                <NavigationMenuItem>
                  <button
                    onClick={() => router.push("/admin/dashboard")}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    title="Tableau de bord"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <button
                    onClick={handleLogout}
                    className="ml-2 p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-800"
                    title="Se déconnecter"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </NavigationMenuItem>
              </>
            ) : (
              <NavigationMenuItem>
                <Link href="/login" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Login</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
}
