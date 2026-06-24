export interface NavLink {
  label: string;
  href: string;
}

export const navLinks: NavLink[] = [
  { label: "About",    href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Archive",  href: "/archive" },
  { label: "Resume",   href: "/WillCarterResume.pdf" },
  { label: "Contact",  href: "/contact" },
  { label: "Github",   href: "https://github.com/WilliamHCarter" },
];
