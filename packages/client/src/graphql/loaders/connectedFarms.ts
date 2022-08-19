import pMemoize from "p-memoize";
import { z } from "zod";
import { surveyStackApiUrl } from "../../utils/env";

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
    .then((result) => result.json())
    .then(expectedData.parse);

  // return ["oursci.farmos.net","farmatsunnyside.farmos.net","jimsheppard.farmos.net"]
  return data.map((d) => d.instanceName);
});
