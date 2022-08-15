import pMemoize from "p-memoize";
import { isObject, toString } from "lodash";
import { PlantingEventDetail } from "../resolvers.generated";

const toStringObject = (object: object): { [key: string]: string } => {
  const entries = Object.entries(object).map(([key, value]) => [
    JSON.stringify(key),
    JSON.stringify(value),
  ]);

  return Object.fromEntries(entries);
};

// Fetch all the event details for a planting
export const loadEventDetails = pMemoize(
  async (
    plantingId: string
  ): Promise<{ id: string; details: PlantingEventDetail[] }[]> => {
    const externalData: any = await fetch(
      `https://app.surveystack.io/static/coffeeshop/events_new/${plantingId}`
    ).then((result) => result.json());

    return (Array.isArray(externalData) ? externalData : [externalData])
      .filter(isObject)
      .filter((details): details is { id: any } & object => "id" in details)
      .map(({ id, ...details }) => ({
        id: `${plantingId}/${id}`,
        details: Object.entries(details).map(([key, value]) => ({
          __typename: "PlantingEventDetail" as "PlantingEventDetail",
          id: `${plantingId}/${id}/${key}`,
          valueList: Array.isArray(value)
            ? value.map((v) => JSON.stringify(v))
            : null,
          value: Array.isArray(value) ? null : JSON.stringify(value),
          name: key,
        })),
      }));
  },
);
