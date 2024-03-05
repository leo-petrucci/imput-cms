import { type ClassValue, clsx } from "clsx";
import { ResizeObserver } from "@juggle/resize-observer";
import useMeasureHook, { Options } from "react-use-measure";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useMeasure = (props: Options = {}) => {
  return useMeasureHook({ ...props, polyfill: ResizeObserver });
};
