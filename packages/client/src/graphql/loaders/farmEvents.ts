import pMemoize from "p-memoize";
import { isObject } from "lodash";
import { PlantingEventDetail } from "../resolvers.generated";
import { surveyStackApiUrl } from "../../utils/env";

// Fetch all the event details for a planting
export const loadEventDetails = pMemoize(
  async (id: string): Promise<PlantingEventDetail[]> => {
    const externalData: any = await fetch(
      surveyStackApiUrl(`static/coffeeshop/events_new/${id}`)
    ).then((result) => result.json());

    if (!isObject(externalData)) {
      throw new Error(
        `Event details should be an object but its "${externalData}`
      );
    }

    return Object.entries(externalData).map(([key, value]) => ({
      __typename: "PlantingEventDetail" as "PlantingEventDetail",
      id: `${id}/${key}`,
      valueList: Array.isArray(value)
        ? value.map((v) => JSON.stringify(v))
        : null,
      value: Array.isArray(value) ? null : JSON.stringify(value),
      name: key,
    }));
  }
);
