import { isObject, startCase, toString } from "lodash";

export const formatValue = (value: any) => {
  return isObject(value)
    ? JSON.stringify(value)
    : toString(value).replaceAll("_", " ").trim();
};

export const prettyKey = (key: string) =>
  key.length <= 3 ? key : startCase(key.toLowerCase());
