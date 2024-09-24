interface Props {
  format: string;
}

export const AvailableFormatCard = ({ format }: Props) => {
  return (
    <div className="h-fit w-fit rounded-full bg-white px-3 py-1 text-indigo-900">
      {format}
    </div>
  );
};
