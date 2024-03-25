import React from "react";

export default function ArrowIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="12" height="13" viewBox="0 0 12 13" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="m6 1.111 5.684 5.684L6 12.48l-1.004-1.004L8.96 7.493H.316V6.097H8.96L4.996 2.115z" fill="currentColor"
            fillRule="nonzero" />
    </svg>
  );
}