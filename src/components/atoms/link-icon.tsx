import { AnchorHTMLAttributes, DetailedHTMLProps, SVGProps } from "react";

interface iProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  Icon: (props: SVGProps<SVGRectElement>) => JSX.Element;
  text: string;
  span?: string;
}
export function LinkIcon({ Icon, span,text, ...props }: iProps) {
  return (
    <div className="text-gray flex gap-1 flex-wrap items-center">
      <Icon />
      {span && <span><b>{span}</b></span>}
      <a className="hover:underline break-words break-normal" style={{wordBreak: "break-word"}} {...props}>{text.split("").map((letter, index) => <span key={index}>{letter}</span>)}</a>
    </div>
  );
}
