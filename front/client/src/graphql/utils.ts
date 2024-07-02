import { GraphQLError } from "graphql";
import { ZodType, z } from "zod";

export const parseZod =
  <T extends ZodType>(schema: T) =>
  (data: any) => {
    const parsed = schema.safeParse(data);
    if (parsed.success) {
      return parsed.data as z.infer<T>;
    }
    let dataSample = String(data);
    try {
      dataSample = JSON.stringify(data);
    } catch (e) {}
    if (dataSample.length > 100) {
      dataSample = dataSample.slice(0, 100) + "…";
    }
    throw new GraphQLError(
      `Parsing incoming data: ${parsed.error.message}\nReceived:\n${dataSample}`
    );
  };
