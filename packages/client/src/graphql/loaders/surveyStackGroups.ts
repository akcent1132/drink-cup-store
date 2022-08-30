import { GraphQLError } from "graphql";
import pMemoize from "p-memoize";
import { z } from "zod";
import { surveyStackApiUrl } from "../../utils/env";
import { parseZod } from "../utils";

const expectedData = z.array(
  z.object({
    // _id: z.string(),
    // user: z.object({ _id: z.string(), email: z.string(), name: z.string() }),
    group: z.object({
      _id: z.string(),
      //   meta: z.object({
      //     archived: z.boolean(),
      //     specVersion: z.number(),
      //     invitationOnly: z.boolean(),
      //   }),
      name: z.string(),
      // slug: z.string(),
      //   dir: z.string(),
      //   path: z.string(),
      //   surveys: z.object({ pinned: z.array(z.unknown()) }),
    }),
    // role: z.string(),
    // meta: z.object({
    //   status: z.string(),
    //   dateCreated: z.string(),
    //   dateSent: z.null(),
    //   dateActivated: z.string(),
    //   notes: z.string(),
    //   invitationEmail: z.null(),
    //   invitationCode: z.null(),
    // }),
  })
);

export const loadSurveyStackGroups = pMemoize(async (userId, authorization) => {
  if (!userId) {
    return [];
  }
  const data = await fetch(
    surveyStackApiUrl(`api/memberships?user=${userId}&populate=1`),
    {
      headers: {
        Authorization: authorization,
      },
    }
  )
    .then(async (result) => {
      if (!result.ok) {
        throw new GraphQLError(await result.text());
      }
      return result;
    })
    .then((result) => result.json())
    .then(parseZod(expectedData));

  return data.map((d) => ({
    id: d.group._id,
    name: d.group.name,
  }));
});
