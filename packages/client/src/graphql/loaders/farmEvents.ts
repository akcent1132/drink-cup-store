import pMemoize from "p-memoize";
import { isObject } from "lodash";
import { PlantingEventDetail } from "../resolvers.generated";

// Fetch all the event details for a planting
export const loadEventDetails = pMemoize(
  async (id: string): Promise<PlantingEventDetail[]> => {
    const externalData: any = await fetch(
      `${process.env.REACT_APP_SURVEY_STACK_API_URL}static/coffeeshop/events_new/${id}`
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
