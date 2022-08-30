import { GraphQLError } from "graphql";
import pMemoize from "p-memoize";
import { z, ZodType, ZodTypeAny } from "zod";
import { surveyStackApiUrl } from "../../utils/env";
import { parseZod } from "../utils";

const expectedData = z.array(
  z.object({
    // _id: z.string(),
    // userId: z.string(),
    // owner: z.boolean(),
    instanceName: z.string(),
  })
);

// Fetch all the event details for a planting
export const loadConnectedFarmIds = pMemoize(async (authorization) => {
  if (!authorization) {
    return [];
  }
  const data = await fetch(surveyStackApiUrl("api/farmos/farms"), {
    headers: {
      Authorization: authorization,
    },
  })
    .then(async (result) => {
      if (!result.ok) {
        throw new GraphQLError(await result.text());
      }
      return result;
    })
    .then((result) => result.json())
    .then(parseZod(expectedData));
  return data.map((d) => d.instanceName);
});
