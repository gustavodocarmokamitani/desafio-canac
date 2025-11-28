import React, { SVGProps } from "react";

interface SearchIconProps extends SVGProps<SVGSVGElement> {}

const SearchIcon: React.FC<SearchIconProps> = ({
  className,
  width = 24,
  height = 24,
  ...rest
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className} 
      {...rest}
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </svg>
  );
};

export default SearchIcon;
