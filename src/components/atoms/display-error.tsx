import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CiCircleAlert, CiCircleCheck, CiCircleRemove } from "react-icons/ci";
import { FiChevronDown, FiChevronRight, FiClock } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { IoChevronBack, IoReload } from "react-icons/io5";
import Button from "../commons/button";
import FormattedText from "./formattedText";
export type AlertStatus = "success" | "error" | "warning" | "info";

export interface JsonFeedBacksCardProps {
  message: string;
  status: AlertStatus;
  show?: boolean;
  errorDetails?: any;
  timestamp?: string;
  code?: string | number;
  stack?: boolean;
  showActions?: boolean;
}

const Icon = ({ status }: { status: AlertStatus }) => {
  if (status == "success") return <CiCircleCheck />;
  else if (status == "warning") return <CiCircleAlert />;
  else return <CiCircleRemove />;
};

export const JsonFeedBacksCard = ({
  message,
  status,
  show = true,
  errorDetails,
  timestamp,
  code,
  stack = false,
  showActions = true,
}: JsonFeedBacksCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const formatJson = (data: any) => {
    try {
      return JSON.stringify(data, null, 2);
    } catch (e) {
      return String(data);
    }
  };

  const statusStyles = {
    error: "border-red-200 bg-red-50 dark:bg-red-200",
    success: "border-green-200 bg-green-50 dark:bg-green-200",
    warning: "border-yellow-200 bg-yellow-50 dark:bg-yellow-200",
    info: "border-blue-200 bg-blue-50 dark:bg-blue-200",
  };

  const headerStyles = {
    error: "bg-red-100 dark:bg-red-300",
    success: "bg-green-100 dark:bg-green-300",
    warning: "bg-yellow-100 dark:bg-yellow-300",
    info: "bg-blue-100 dark:bg-blue-300",
  };

  const colorStyle = {
    error: "text-red-500 dark:text-red-900",
    success: "text-green-500 dark:text-green-900",
    warning: "text-yellow-500 dark:text-yellow-900",
    info: "text-blue-500 dark:text-blue-900",
  };

  useEffect(() => {
    if (code != null && message != null) {
      if (code === 401 && message === "Unauthorized") {
        router.push("/auth/login");
      }
    }
  }, [code, message, router]);

  if (!show) return null;

  return (
    <div className="h-fit w-full bg-background p-10 rounded-md flex flex-col gap-5 max-md:p-5">
      <div className="flex flex-col justify-center items-center gap-5 text-xl ">
        {showActions && (
          <div className="w-full flex gap-5">
            <Button
              className="w-full p-2"
              variant="outline"
              onClick={() => router.back()}
            >
              <IoChevronBack size={20} />
              <span className="w-full">retour</span>
            </Button>
            {status == "error" ? (
              <Button
                className="w-full p-2"
                variant="secondary"
                onClick={() => globalThis.location.reload()}
              >
                <IoReload size={20} />
                <span className="w-full">rafraichir</span>
              </Button>
            ) : (
              ""
            )}
          </div>
        )}
        <h1
          className={`text-4xl flex gap-2.5 items-center ${colorStyle[status]}`}
        >
          <Icon {...{ status }} /> {code}
        </h1>
        <div>
          <FormattedText text={message} />
        </div>
      </div>
      <div
        className={`rounded-lg border dark:text-background overflow-hidden ${statusStyles[status]}`}
      >
        <div
          // type="button"
          className={`px-4 py-3 ${headerStyles[status]} flex items-center justify-between cursor-pointer`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="w-full flex items-center justify-between gap-3">
            <span className="w-full flex items-center gap-3">
              {isExpanded ? (
                <FiChevronDown className="w-5 h-5" />
              ) : (
                <FiChevronRight className="w-5 h-5" />
              )}
              <span className="font-medium">
                {" "}
                <FormattedText text={message} />
              </span>
              {code && (
                <code className="text-sm px-2 py-1 rounded-full bg-background/50">
                  Code: {code}
                </code>
              )}
            </span>
            {showActions && (
              <button
                type="button"
                title="fermer"
                className="text-lg"
                onClick={() => router.back()}
              >
                <IoMdClose size={30} />
              </button>
            )}
          </div>
          {timestamp && (
            <div className="flex items-center gap-2 text-sm">
              <FiClock className="w-4 h-4" />
              {timestamp}
            </div>
          )}
        </div>

        {isExpanded && (
          <div className="p-4 space-y-4 ">
            {errorDetails && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Détails :</h4>
                <pre className="bg-black/5 p-3  rounded-lg text-sm  text-wrap">
                  {formatJson(errorDetails)}
                </pre>
              </div>
            )}

            {stack && errorDetails?.stack && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Stack Trace:</h4>
                <pre className="bg-black/5 p-3 rounded-lg text-sm overflow-auto whitespace-pre-wrap">
                  {errorDetails.stack}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
