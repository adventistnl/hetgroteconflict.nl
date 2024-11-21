import { transport } from "./transport";

export async function verifyTransport() {
  try {
    const testResult = await transport.verify();
  } catch (error) {
    console.error(error);
    return;
  }
}
