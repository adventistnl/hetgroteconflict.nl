import { unstable_setRequestLocale } from "next-intl/server";
import { AuthPage } from "@/components/organisms/auth-page";

type Props = { params: { locale: string } };

export default function AuthRoute({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  return <AuthPage />;
}
