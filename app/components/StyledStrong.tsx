"use client";

interface StyledStrongProps {
  children: React.ReactNode;
}

const StyledStrong = ({ children }: StyledStrongProps) => (
  <strong className="font-semibold dark:bg-gradient-to-r dark:from-purple-500 dark:to-blue-500 dark:bg-clip-text dark:text-transparent print:text-inherit">
    {children}
  </strong>
);

export default StyledStrong;