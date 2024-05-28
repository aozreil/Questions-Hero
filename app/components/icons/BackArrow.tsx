import React from "react";

export default function BackArrow(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="14" height="15" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M10.889 7.403a.966.966 0 0 1-.301.709l-5.955 6.025a.836.836 0 0 1-.624.267.853.853 0 0 1-.452-.123.934.934 0 0 1-.324-.329.898.898 0 0 1-.122-.465c0-.25.092-.473.276-.666l5.37-5.42-5.37-5.416a.928.928 0 0 1-.276-.665c0-.171.04-.326.122-.464a.934.934 0 0 1 .324-.33.853.853 0 0 1 .452-.122c.244 0 .452.087.624.26l5.955 6.03c.102.105.178.216.226.331a.983.983 0 0 1 .075.378z" fill="currentColor" fillRule="nonzero"/>
    </svg>
  )
}