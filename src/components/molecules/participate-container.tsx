"use client";

import { useTranslations } from "next-intl";
import { StepContainer } from "./step-container";

export const ParticipateContainer = () => {
  const translations = useTranslations(
    "participate-page-container.how-to-participate-container"
  );
  const translationStepOne = useTranslations(
    "participate-page-container.how-to-participate-container.step-one"
  );
  const translationStepTwo = useTranslations(
    "participate-page-container.how-to-participate-container.step-two"
  );
  const translationStepThree = useTranslations(
    "participate-page-container.how-to-participate-container.step-three"
  );
  const translationStepFour = useTranslations(
    "participate-page-container.how-to-participate-container.step-four"
  );

  return (
    <div className="flex flex-col gap-10">
      <h2 className="text-5xl text-primary text-center">
        {translations("title")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StepContainer
          show_border={true}
          picture_src="/participate-steps/church.svg"
          step_sub={translations("step-sub")}
          explanation={translationStepOne("explanation")}
          step_count={translationStepOne("step-count")}
          link_sub={translationStepOne("link-sub")}
          href="http://www.youtube.com.br"
        />
        <StepContainer
          show_border={true}
          second_step
          picture_src="/participate-steps/territory.svg"
          step_sub={translations("step-sub")}
          explanation={translationStepTwo("explanation")}
          step_count={translationStepTwo("step-count")}
          link_sub={translationStepTwo("link-sub")}
        />
        <StepContainer
          show_border={true}
          picture_src="/participate-steps/publisher.svg"
          step_sub={translations("step-sub")}
          explanation={translationStepThree("explanation")}
          step_count={translationStepThree("step-count")}
          link_sub={translationStepThree("link-sub")}
          href="http://www.youtube.com.br"
        />
        <StepContainer
          last_step
          show_border={true}
          picture_src="/participate-steps/distribute.svg"
          step_sub={translations("step-sub")}
          explanation={translationStepFour("explanation")}
          step_count={translationStepFour("step-count")}
          link_sub={translationStepFour("link-sub")}
        />
      </div>
    </div>
  );
};
