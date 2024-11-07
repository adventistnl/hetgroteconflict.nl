import React from "react";

interface CountryFlagProps {
  countryCode: string;
}

export const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode }) => {
  return <span className={`fi fi-${countryCode.toLowerCase()}`} />;
};
