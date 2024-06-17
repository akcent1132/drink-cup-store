import urlJoin from "url-join";

export const surveyStackApi = (): string => {
  if (!process.env.REACT_APP_SURVEY_STACK_API_URL) {
    throw new Error("process.env.REACT_APP_SURVEY_STACK_API_URL is not set!");
  }
  return process.env.REACT_APP_SURVEY_STACK_API_URL;
};

export const surveyStackApiUrl = (path: string): string => {
  return urlJoin(surveyStackApi(), path);
};
