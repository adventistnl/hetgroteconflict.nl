import TalkToUsFormData from "@/app/interfaces/talk-to-us-form-data";
import { ParticipatePageContainer } from "@/components/organisms/participate-page-container";
import { sendTalkToUsConfirmationEmail } from "@/utils/send-email/send-talk-to-us-confirmation-email";
import { sendTalkToUsEmail } from "@/utils/send-email/send-talk-to-us-email";

export default function ParticipatePage() {
  async function talkToUsFunction(formData: TalkToUsFormData) {
    "use server";
    await sendTalkToUsEmail(formData);
    await sendTalkToUsConfirmationEmail(formData);
    return null;
  }

  return (
    <div className="flex flex-col text-slim items-center justify-center">
      <ParticipatePageContainer talkToUsFunctions={talkToUsFunction} />
    </div>
  );
}
