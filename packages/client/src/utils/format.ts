import { isObject, toString } from "lodash";

export const formatValue = (value: any) => {
  return isObject(value)
    ? JSON.stringify(value)
    : toString(value).replaceAll("_", " ").trim();
};
