interface CountryFlagProps {
  countryCode: string;
}

// This function checks if the provided country code is "TW" and change to "GH".
const mapCountryCode = (code: string): string => {
  return code.toLowerCase() === "tw" ? "gh" : code.toLowerCase();
};

export const CountryFlag: React.FC<CountryFlagProps> = ({ countryCode }) => {
  return <span className={`fi fi-${mapCountryCode(countryCode)}`} />;
};
