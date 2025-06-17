import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import animationData from "@assets/lottie-json.json"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const colors = [
  "bg-[#712c45] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ff66a2] text-[#ff006a] border-[1px] border-[#ff66aabb]",
  "bg-[#0066aa] text-[#0066a0] border-[1px] border-[#0066aabb]",
  "bg-[#4cc9f0] text-[#4cc9f0] border-[1px] border-[#4cc9f0bb]",
];

export const getColor = (color) => {
  if (color >= 0 && color < colors.length) {
    return colors[color];
  }
  return colors[0]; // Fallback to the first color if out of range
};


export const animationDefaultOptions = {
  loop:true,
  autoplay:true,
  animationData,

}