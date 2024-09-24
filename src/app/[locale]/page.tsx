import { HomePageContainer } from "@/components/organisms/home-page-container";
import FormData from "../interfaces/form-data";
import { sendOrderInfo } from "@/utils/send-email/send-order-info";
import { sendOrderConfirmationEmail } from "@/utils/send-email/send-order-confirmation-email";
import TalkToUsFormData from "../interfaces/talk-to-us-form-data";
import { sendTalkToUsEmail } from "@/utils/send-email/send-talk-to-us-email";
import { sendTalkToUsConfirmationEmail } from "@/utils/send-email/send-talk-to-us-confirmation-email";

export default function Homepage() {
  async function receiveAtHomeFunctions(formData: FormData) {
    "use server";
    await sendOrderInfo(formData);
    await sendOrderConfirmationEmail(formData);
    return null;
  }

  async function talkToUsFunction(formData: TalkToUsFormData) {
    "use server";
    await sendTalkToUsEmail(formData);
    await sendTalkToUsConfirmationEmail(formData);
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center" >
      <HomePageContainer
        receiveAtHomeFunctions={receiveAtHomeFunctions}
        talkToUsFunctions={talkToUsFunction}
      />
    </div>
  );
}
