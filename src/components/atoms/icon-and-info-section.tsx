import Image from "next/image";

interface Props {
  icon: string;
  title: string;
  text: string;
}

export const IconAndInfoSection = ({ icon, title, text }: Props) => {
  return (
    <div className="flex flex-row gap-3">
      <Image src={icon} alt={title} width={40} height={40} />
      <div className="flex flex-col text-primary">
        <p className="text-lg font-bold">{title}</p>
        <span>{text}</span>
      </div>
    </div>
  );
};
