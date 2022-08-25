import pMemoize from "p-memoize";
import { z } from "zod";
import { surveyStackApiUrl } from "../../utils/env";
import { isNonNull } from "../../utils/ts";
import { Row } from "../resolvers.generated";

const externalRow = z.object({
  name: z.string(),
  hierarchy: z.array(z.string()),
  isAggregatable: z.boolean(),
  unit: z.string().optional(),
  modus_test_id: z.string().optional(),
});




// Fetch all the event details for a planting
export const loadRows = pMemoize(
  async (): Promise<Row[]> => {
    const data = await fetch(surveyStackApiUrl("static/coffeeshop/hierarchy"))
      .then((result) => result.json())
      .then((data) => {
        const rows = z.array(z.any()).parse(data);
        return rows.map((row) => {
          const parsed = externalRow.safeParse(row);
          if (!parsed.success) {
            console.error(
              `Received invalid row format: "${JSON.stringify(row)}`,
              parsed.error
            );
            return null;
          }
          const {modus_test_id, ...parsedRow} = parsed.data
          return {
            modusTestId: modus_test_id,
            ...parsedRow,
          };
        }).filter(isNonNull);
      });

    return data;
  }
);
