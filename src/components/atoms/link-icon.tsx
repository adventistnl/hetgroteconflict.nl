import { SVGProps } from "react";

interface iProps {
  Icon: (props: SVGProps<SVGRectElement>) => JSX.Element;
  href: string;
  text: string;
}
export function LinkIcon({ Icon, href, text }: iProps) {
  return (
    <div className="flex gap-1 items-center">
      <Icon />
      <a href={href}>{text}</a>
    </div>
  );
}
