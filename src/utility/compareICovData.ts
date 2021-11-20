import { ICovData } from "../types/ICovData";

export function compare(
  curr: ICovData,
  prev: ICovData,
  cat: "County" | "Highest" | "Lowest"
): number {
  if (cat === "County") {
    if (curr.county < prev.county) {
      return -1;
    }
    if (curr.county > prev.county) {
      return 1;
    }
  } else if (cat === "Highest") {
    if (curr.cases7_per_100k < prev.cases7_per_100k) {
      return -1;
    }
    if (curr.cases7_per_100k > prev.cases7_per_100k) {
      return 1;
    }
  } else if (cat === "Lowest") {
    if (curr.cases7_per_100k > prev.cases7_per_100k) {
      return -1;
    }
    if (curr.cases7_per_100k < prev.cases7_per_100k) {
      return 1;
    }
  }

  return 0;
}
