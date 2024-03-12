import React from "react";

interface Props extends React.SVGProps<SVGSVGElement> {
  colorfill?: string;
}

export default function CloseIcon(props: Props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#a)" fill={props?.colorfill ? props?.colorfill : "#fff"}>
        <path d="M1.06 24a1.1 1.1 0 0 1-.75-.31 1.06 1.06 0 0 1 0-1.49L22.15.31a1 1 0 0 1 1.49 0 1.06 1.06 0 0 1 0 1.49L1.85 23.69a1.06 1.06 0 0 1-.79.31z"/>
        <path d="M22.85 24a1.06 1.06 0 0 1-.75-.32L.31 1.79A1.06 1.06 0 0 1 .654.07 1.06 1.06 0 0 1 1.81.3L23.6 22.19a1.06 1.06 0 0 1 0 1.49 1.052 1.052 0 0 1-.75.32z"/>
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h23.9v24H0z"/>
        </clipPath>
      </defs>
    </svg>
  )
}