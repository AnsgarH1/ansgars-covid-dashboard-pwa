import { ICovData } from "../types/ICovData";

export function compare(curr: ICovData, prev: ICovData): number {
  if (curr.county < prev.county) {
    return -1;
  }
  if (curr.county > prev.county) {
    return 1;
  }
  return 0;
}
