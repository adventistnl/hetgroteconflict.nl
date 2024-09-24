import { transport } from "./transport";

export async function verifyTransport() {
  try {
    const testResult = await transport.verify();
    console.log(testResult);
  } catch (error) {
    console.log(error);
    return;
  }
}
