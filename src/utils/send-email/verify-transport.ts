import { transport } from "./transport";

export async function verifyTransport() {
  try {
    await transport.verify();
  } catch (error) {
    console.error(error);
    return;
  }
}
