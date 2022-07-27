import { startCase } from "lodash";

export const prettyKey = (key: string) =>
  key.length <= 3 ? key : startCase(key.toLowerCase());
