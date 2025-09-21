import React from 'react';

const EyeOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 11 8 11 8a18.35 18.35 0 0 1-2.18 3.19" />
    <path d="M2.39 2.39 1.07 1.07 21.84 21.84" />
    <path d="M3.8 3.8A18.35 18.35 0 0 0 1 12s4 8 11 8a10.43 10.43 0 0 0 4.18-1.07" />
  </svg>
);

export default EyeOffIcon;