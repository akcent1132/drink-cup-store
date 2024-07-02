import { isNil, isObject } from "lodash";
import pMemoize from "p-memoize";
import { z } from "zod";
import { surveyStackApiUrl } from "../../utils/env";
import { formatValue, prettyKey } from "../../utils/format";
import { PlantingEventDetail } from "../resolvers.generated";

const notesSchema = z.object({ Notes: z.object({ value: z.string() }) });

export const convertEventDetails = (
  externalData: any,
  eventId: string
): PlantingEventDetail[] => {
  if (!isObject(externalData)) {
    throw new Error(
      `Event details should be an object but its "${externalData}`
    );
  }

  // Try to add data from 'Notes.values'
  const parsedNotes = notesSchema.safeParse(externalData);
  if (parsedNotes.success) {
    try {
      // replace Notes with ...Notes.value
      console.log("replace notes with ", parsedNotes.data.Notes.value);
      externalData = {
        ...externalData,
        Notes: null,
        ...JSON.parse(parsedNotes.data.Notes.value),
      };
    } catch (e) {
      console.warn("Failed to parse Notes.value as JSON", e);
    }
  }

  // Quantities have a forman `Quantity N: "(actual name) value`"
  const rxQuantityValue = /\((.+)\)(.+)/;

  return (
    Object.entries(externalData)
      .filter(
        ([key, value]) =>
          !isNil(value) &&
          (!Array.isArray(value) || value.length > 0) &&
          key !== "drupal_uid"
      )
      .map(([key, value]) => ({
        __typename: "PlantingEventDetail" as "PlantingEventDetail",
        id: `${eventId}/${key}`,
        valueList: Array.isArray(value)
          ? value.map((v) => formatValue(v))
          : null,
        value: Array.isArray(value) ? null : formatValue(value),
        name: prettyKey(key),
      }))
      // Convert quantities
      .map((detail) => {
        if (
          detail.name.toLowerCase().includes("quantity") &&
          detail.value &&
          rxQuantityValue.test(detail.value)
        ) {
          let [_, name, value] = detail.value.match(rxQuantityValue)!;
          name = prettyKey(name);
          value = formatValue(value);
          return value && name ? { ...detail, name, value } : detail;
        }
        return detail;
      })
  );
};

// Fetch all the event details for a planting
export const loadEventDetails = pMemoize(
  async (id: string): Promise<PlantingEventDetail[]> => {
    const externalData: any = await fetch(
      surveyStackApiUrl(`static/coffeeshop/events_new/${id}`)
    ).then((result) => result.json());

    return convertEventDetails(externalData, id);
  }
);
