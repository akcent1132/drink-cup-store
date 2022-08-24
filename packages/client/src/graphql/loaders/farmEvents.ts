import { isNil, isObject, toString } from "lodash";
import pMemoize from "p-memoize";
import { surveyStackApiUrl } from "../../utils/env";
import { PlantingEventDetail } from "../resolvers.generated";

const formatValue = (value: any) =>
  isObject(value)
    ? JSON.stringify(value, null, 2)
    : !Number.isNaN(Date.parse(value))
    ? `${new Date(value).toLocaleDateString()} ${new Date(
        value
      ).toLocaleTimeString()}`
    : toString(value);

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

    return Object.entries(externalData)
      .filter(
        ([key, value]) =>
          !isNil(value) &&
          (!Array.isArray(value) || value.length > 0) &&
          key !== "drupal_uid"
      )
      .map(([key, value]) => ({
        __typename: "PlantingEventDetail" as "PlantingEventDetail",
        id: `${id}/${key}`,
        valueList: Array.isArray(value)
          ? value.map((v) => formatValue(v))
          : null,
        value: Array.isArray(value) ? null : formatValue(value),
        name: key,
      }));
  }
);
