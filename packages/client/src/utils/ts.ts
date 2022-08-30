import { isNil } from "lodash";

export const isNonNull = <T>(value: T): value is NonNullable<T> => value !== null;
export const isNonNil = <T>(value: T | null | undefined): value is T => !isNil(value);