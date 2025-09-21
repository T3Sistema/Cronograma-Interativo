
import React from 'react';

interface SparklesIconProps extends React.SVGProps<SVGSVGElement> {}

const SparklesIcon: React.FC<SparklesIconProps> = (props) => (
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
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6-10A2 2 0 0 0 4.063 2.5l10 6A2 2 0 0 0 15.5 9.937" />
    <path d="M14.063 8.5A2 2 0 0 0 15.5 9.937l6 10a2 2 0 0 0-1.563 3.563l-10-6A2 2 0 0 0 8.5 14.063" />
    <path d="M22 2 18 6" />
    <path d="m2 22 4-4" />
    <path d="m2 6 4-4" />
    <path d="m18 22 4-4" />
  </svg>
);

export default SparklesIcon;
