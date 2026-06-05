import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { MainContainer } from "@/components/molecules/main-container";
import dynamic from "next/dynamic";

const ExitIntentModal = dynamic(
  () => import("@/components/molecules/exit-intent-modal").then((m) => m.ExitIntentModal),
  { ssr: false }
);

const DevTestModalButton = process.env.NODE_ENV === "development"
  ? dynamic(() => import("@/components/molecules/dev-test-modal-button").then((m) => m.DevTestModalButton), { ssr: false })
  : null;

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  unstable_setRequestLocale(locale);
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <MainContainer>{children}</MainContainer>
      <ExitIntentModal />
      {DevTestModalButton && <DevTestModalButton />}
    </NextIntlClientProvider>
  );
}
