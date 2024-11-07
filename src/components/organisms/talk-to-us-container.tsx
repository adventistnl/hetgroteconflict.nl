"use client";

import TalkToUsFormData from "@/app/interfaces/talk-to-us-form-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "../atoms/input";
import { Button } from "../atoms/button";
import { useEffect, useRef, useState } from "react";
import { Textarea } from "../atoms/textarea";
import { useRefStore } from "../stores/ref-store";

interface Props {
  talkToUsFunctions: (formData: TalkToUsFormData) => Promise<null>;
}

export const TalkToUsContainer = ({ talkToUsFunctions }: Props) => {
  //States and Hooks
  const translations = useTranslations("talk-to-us-container");
  const { setRef_TalkToUsSection } = useRefStore();
  const talkToUsSectionRef = useRef<HTMLDivElement | null>(null);
  // const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const FormSchema = z.object({
    name: z
      .string({ required_error: translations("form-errors.name") })
      .min(3, { message: translations("form-errors.name") }),
    email: z
      .string({ required_error: translations("form-errors.email") })
      .min(3, { message: translations("form-errors.email") })
      .email({ message: translations("form-errors.valid-email") }),
    message: z
      .string({ required_error: translations("form-errors.message") })
      .min(5, { message: translations("form-errors.message") }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TalkToUsFormData>({
    resolver: zodResolver(FormSchema),
  });

  //Effects
  // useEffect(() => {
  //   setIsClient(true);
  // }, []);

  useEffect(() => {
    setRef_TalkToUsSection(talkToUsSectionRef);
  }, [setRef_TalkToUsSection]);

  //Handlers
  const handleSendEmail = async (data: TalkToUsFormData) => {
    setIsLoading(true);

    try {
      await talkToUsFunctions(data);
      setIsLoading(false);
      setSuccess(translations("success-message"));
    } catch (error) {
      setError(translations("error-message"));
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex w-full items-center justify-center bg-[#191919]"
      ref={talkToUsSectionRef}
    >
      <form
        className="flex w-full flex-col items-center justify-center gap-3 p-6 text-primary text-white laptop:w-[450px]"
        onSubmit={handleSubmit(handleSendEmail)}
      >
        <h6 className="py-3 text-center text-3xl">{translations("title")}</h6>
        <div>
          <Input
            className="border-primary"
            placeholder={translations("form-placeholders.name")}
            {...register("name")}
          />
          <span className="text-xs text-destructive">
            {errors?.name?.message && errors?.name?.message}
          </span>
        </div>
        <div>
          <Input
            className="border-primary"
            placeholder={"Email"}
            {...register("email")}
          />
          <span className="text-xs text-destructive">
            {errors?.email?.message && errors?.email?.message}
          </span>
        </div>
        <div>
          <Textarea
            placeholder={translations("form-placeholders.message")}
            {...register("message")}
          />

          <span className="text-xs text-destructive">
            {errors?.message?.message && errors?.message?.message}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          <Button
            // className="bg-primary text-white hover:bg-slate-700"
            type="submit"
            size="md"
            disabled={isLoading}
            variant={"default"}
          >
            {isLoading ? translations("loading") : translations("button")}
          </Button>
          {error && (
            <span className="text-sm font-medium text-destructive">
              {error}
            </span>
          )}
          {success && (
            <span className="text-sm font-medium text-green-500">
              {success}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};
