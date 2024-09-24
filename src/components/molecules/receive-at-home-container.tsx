"use client";

import { TextField } from "@mui/material";
import { styled } from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../atoms/button";
import { useEffect, useRef, useState } from "react";
import { SelectCountry } from "./select-country";
import { useTranslations } from "next-intl";
import FormData from "@/app/interfaces/form-data";
import { useRefStore } from "../stores/ref-store";
import Image from "next/image";

interface Props {
  receiveAtHomeFunctions(formData: FormData): Promise<null>;
}

const CustomTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#E0E3E7",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#E0E3E7",
    },
  },
  "& .MuiInputLabel-root": {
    color: "#E0E3E7",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#E0E3E7",
  },
}));

export const ReceiveAtHomeContainer = ({ receiveAtHomeFunctions }: Props) => {
  const translations = useTranslations("receive-at-home-container");
  const { setRef_ReceiveAtHomeSection } = useRefStore();
  const receiveAtHomeSectionRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const FormSchema = z.object({
    country: z
      .string({ required_error: translations("form-errors.country") })
      .min(3, { message: translations("form-errors.country") }),
    name: z
      .string({ required_error: translations("form-errors.name") })
      .min(3, { message: translations("form-errors.name") }),
    email: z
      .string({ required_error: translations("form-errors.email") })
      .min(3, { message: translations("form-errors.email") })
      .email({ message: translations("form-errors.valid-email") }),
    street: z
      .string({ required_error: translations("form-errors.street") })
      .min(3, { message: translations("form-errors.street") }),
    number: z
      .string({ required_error: translations("form-errors.number") })
      .min(2, { message: translations("form-errors.number") }),
    city: z
      .string({ required_error: translations("form-errors.city") })
      .min(3, { message: translations("form-errors.city") }),
    postCode: z
      .string({ required_error: translations("form-errors.postCode") })
      .min(3, { message: translations("form-errors.postCode") }),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setValue("country", "Netherlands");
  }, [setValue]);

  useEffect(() => {
    setRef_ReceiveAtHomeSection(receiveAtHomeSectionRef);
  }, []);

  const handleOrder = async (data: FormData) => {
    setIsLoading(true);
    try {
      await receiveAtHomeFunctions(data);
      setSuccess(translations("success-message"));
      setError(""); // Clear error message on success
    } catch (error) {
      setError(translations("error-message"));
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (name: keyof FormData, placeholder: string) => (
    <div className="w-5/6">
      <CustomTextField
        variant="outlined"
        size="small"
        label={placeholder}
        fullWidth
        {...register(name)}
        error={!!errors[name]}
        helperText={errors[name]?.message}
      />
    </div>
  );

  return (
    isClient && (
      <div
        className="relative flex w-full bg-primary pb-12"
        ref={receiveAtHomeSectionRef}
      >
        <Image
          className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 transform object-cover opacity-50"
          src="/book-background.svg"
          alt="book-background"
          width={5000}
          height={5000}
        />
        <form
          className="relative z-10 ml-12 mt-12 flex w-full flex-col gap-3 p-2 laptop:w-[450px]"
          onSubmit={handleSubmit(handleOrder)}
        >
          <h6 className="text-5xl font-bold text-white drop-shadow-2xl">
            {translations("title")}
          </h6>
          <h6 className="text-gray drop-shadow-md">
            {translations("subtitle")}
          </h6>

          <div className="w-5/6">
            <SelectCountry setValue={setValue} />
            <span className="text-xs text-destructive">
              {errors?.country?.message}
            </span>
          </div>

          {renderInput("name", translations("form-placeholders.name"))}
          {renderInput("email", "Email")}
          {renderInput("street", translations("form-placeholders.street"))}
          {renderInput("number", translations("form-placeholders.number"))}
          {renderInput("city", translations("form-placeholders.city"))}
          {renderInput("postCode", translations("form-placeholders.postCode"))}

          <div className="flex w-5/6 flex-col items-center justify-center gap-2">
            <Button type="submit" size="md" disabled={isLoading}>
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
    )
  );
};
