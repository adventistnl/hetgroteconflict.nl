import { ParticipatePageContainer } from "@/components/organisms/participate-page-container";

export default function Homepage({
  params,
}: {
  params: Promise<{ home: string }>;
}) {
  return (
    <div className="flex flex-col text-slim items-center justify-center">
      <ParticipatePageContainer />
    </div>
  );
}
