import { allPapers } from "./.content-collections/generated";
import type { Paper } from "./.content-collections/generated";

export default allPapers.sort(
	(a: Paper, b: Paper) => (a.year || 0) - (b.year || 0),
);
export type { Paper };
