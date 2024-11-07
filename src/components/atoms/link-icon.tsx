import { AnchorHTMLAttributes, DetailedHTMLProps, SVGProps } from "react";

interface iProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  Icon: (props: SVGProps<SVGRectElement>) => JSX.Element;
  text: string;
}
export function LinkIcon({ Icon, text, ...props }: iProps) {
  return (
    <div className="flex gap-1 items-center">
      <Icon />
      <a {...props}>{text}</a>
    </div>
  );
}
