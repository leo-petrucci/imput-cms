import { ResizeObserver } from "@juggle/resize-observer";
import useMeasureHook, { Options } from "react-use-measure";

const useMeasure = (props: Options = {}) => {
  return useMeasureHook({ ...props, polyfill: ResizeObserver });
};

export default useMeasure;
