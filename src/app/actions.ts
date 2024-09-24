"use server";

import FormData from "./interfaces/form-data";

export const sendMailAction = async (
  func: (data: FormData) => Promise<void>,
  data: FormData,
) => {
  await func(data);
};
