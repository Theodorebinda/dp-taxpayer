import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline" | "success" | "destructive";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  type?: "button" | "reset" | "submit";
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  disabled = false,
  isLoading = false,
  className = "",
  type = "button",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded transition duration-200 ease-in-out";

  const variants = {
    primary:
      "flex items-center gap-2 bg-primary text-background px-4 py-2 rounded-md shadow hover:bg-primary/70",
    secondary:
      "bg-bg-secondary text-foreground hover:!text-background hover:bg-foreground disabled:bg-gray-300 disabled:cursor-not-allowed",
    outline:
      "border border-primary text-primary hover:bg-primary hover:text-white disabled:border-gray-400 disabled:text-gray-400 disabled:cursor-not-allowed",
    success:
      "bg-app-green-500 text-white hover:bg-app-green-600 disabled:bg-green-300 disabled:cursor-not-allowed",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed",
  };

  const sizes = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${
        sizes[size]
      } ${className} flex items-center gap-2 transition-all ${
        isLoading || disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {isLoading ? (
        <span className="inline-flex items-center">
          <svg
            className="animate-spin h-5 w-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 100 8V4a8 8 0 01-8 8z"
            ></path>
          </svg>
          <span className="ml-2">Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
