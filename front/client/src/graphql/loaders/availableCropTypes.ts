import pMemoize from "p-memoize";
import { isObject, toString } from "lodash";
import { AvailableCropType, PlantingEventDetail } from "../resolvers.generated";
import { surveyStackApiUrl } from "../../utils/env";

declare module externalData {
  export interface Crop {
    amount: number;
    crop: null | string;
  }
}

// Fetch all the event details for a planting
export const loadAvailableCropTypes = pMemoize(
  async (): Promise<AvailableCropType[]> => {
    const data: externalData.Crop[] = await fetch(
      surveyStackApiUrl("static/coffeeshop/crops")
    ).then((result) => result.json());

    return data
      .filter(
        (x): x is externalData.Crop & { crop: string } =>
          typeof x.crop === "string"
      )
      .map(({ crop, amount }) => ({
        id: crop,
        cropType: crop,
        plantingCount: amount,
      }));
  }
);
