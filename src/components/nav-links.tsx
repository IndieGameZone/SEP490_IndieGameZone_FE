import { useLocation } from "react-router-dom";
import React from "react";
import { usePageTransition } from "@/hooks/use-page-transition";

type NavItem = {
  label: string;
  path: string;
};

const navItems: NavItem[] = [
  { label: "Discover", path: "/" },
  { label: "Search", path: "/search" },
  { label: "Forum", path: "/forum" },
];

const NavLinks: React.FC = () => {
  const location = useLocation();
  const transitionTo = usePageTransition();

  const handleRedirect = (path: string) => {
    if (location.pathname !== path) {
        transitionTo(path);
    }
  };

  return (
    <div className="flex justify-center items-center gap-5 p-5 font-bold text-xl">
      {navItems.map(({ label, path }) => {
        const isActive = location.pathname === path;

        return (
          <button
            key={path}
            onClick={() => handleRedirect(path)}
            className={`hover-underline cursor-pointer ${
              isActive ? "text-white" : "text-gray-500"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default NavLinks;
