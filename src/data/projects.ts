import type { ImageMetadata } from "astro";
import zfetch from "../assets/zfetch.png";
import rattlesnakeridge from "../assets/rattlesnakeridge.webp";
import lyremusicplayer from "../assets/lyremusicplayer.webp";
import movinghomes from "../assets/movinghomes.webp";
import BBOT from "../assets/BBOT.webp";
import BBOTmobile from "../assets/BBOT-mobile.webp";
import Crosswalk from "../assets/Crosswalk.webp";

export interface TechBadge {
  alt: string;
  src: string;
}

export interface Project {
  title: string;
  body: string;
  src: ImageMetadata;
  srcmobile?: ImageMetadata;
  link: string;
  techStack: TechBadge[];
}

export const projects: Project[] = [
  {
    title: "ZFetch",
    body: "Command-line system information tool",
    src: zfetch,
    link: "https://github.com/WilliamHCarter/zfetch",
    techStack: [
      { alt: "Zig", src: "https://img.shields.io/badge/-Zig-F7A41D?style=flat-square&logo=zig&logoColor=white" },
    ],
  },
  {
    title: "Rattlesnake Ridge",
    body: "Multi-agent ML Mystery Game",
    src: rattlesnakeridge,
    link: "https://github.com/WilliamHCarter/rattlesnakeridge",
    techStack: [
      { alt: "React", src: "https://img.shields.io/badge/-React-45b8d8?style=flat-square&logo=react&logoColor=white" },
      { alt: "Flask", src: "https://img.shields.io/badge/-Flask-000000?style=flat-square&logo=flask&logoColor=white" },
    ],
  },
  {
    title: "Lyre",
    body: "Album-focused music player",
    src: lyremusicplayer,
    link: "https://github.com/WilliamHCarter/lyremusicplayer",
    techStack: [
      { alt: "SolidJS", src: "https://img.shields.io/badge/-SolidJS-2C4F7C?style=flat-square&logo=solid&logoColor=white" },
      { alt: "Astro", src: "https://img.shields.io/badge/-Astro-FF5D01?style=flat-square&logo=astro&logoColor=white" },
    ],
  },
  {
    title: "Moving Homes Together Website",
    body: "A simple, professional website built with Astro and TailwindCSS.",
    src: movinghomes,
    link: "https://github.com/WilliamHCarter/movingtogetherwebsite",
    techStack: [
      { alt: "Astro", src: "https://img.shields.io/badge/-Astro-FF5D01?style=flat-square&logo=astro&logoColor=white" },
      { alt: "TailwindCSS", src: "https://img.shields.io/badge/-TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" },
    ],
  },
  {
    title: "BrokerBot",
    body: "Autonomous trading alogrithms system utilizing backtesting via the Alpaca API.",
    src: BBOT,
    srcmobile: BBOTmobile,
    link: "https://github.com/JackMansfield2019/BrokerBot",
    techStack: [
      { alt: "Python", src: "https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white" },
    ],
  },
  {
    title: "Crosswalk",
    body: "Experimental physics game created with Unity for Ludum Dare 46.",
    src: Crosswalk,
    link: "https://github.com/WilliamHCarter/LD46",
    techStack: [
      { alt: "C#", src: "https://img.shields.io/badge/-CSharp-561eba?style=flat-square&logo=csharp&logoColor=white" },
      { alt: "Unity", src: "https://img.shields.io/badge/-Unity-000000?style=flat-square&logo=unity&logoColor=white" },
    ],
  },
];
