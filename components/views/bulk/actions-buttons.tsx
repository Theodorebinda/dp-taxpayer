"use client";

import Button from "@/components/commons/button";
import ImageWithFallback from "@/components/table/components/table-image";
import { InnerAgentData } from "@/types/bulk-view.type";
import { ApiInputType } from "@/types/types";
import HttpClient from "@/utils/http-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserGraduate } from "react-icons/fa";

const ActionButton = ({
  name,
  bulkId,
  value,
  setError,
}: {
  name: string;
  bulkId: string;
  value: string;
  setError: (data: {
    code: number;
    message: string;
    [key: string]: any;
  }) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setLoading(true);
    const httpClient = new HttpClient();
    const response:
      | {
          code: number;
          message: string;
          data: ApiInputType[];
        }
      | false = await httpClient.patch(`/change/payment/bulk/${bulkId}`, {
      validationAction: value,
    });

    if (!response)
      toast.error(
        httpClient.error?.message ||
          "une erreur est survenue. Veuillez réessayer plus  tard",
        {
          duration: 5000,
        }
      );
    else setError(response);

    setLoading(false);
  };
  return (
    <Button
      isLoading={loading}
      variant="primary"
      onClick={async () => {
        await handleClick();
      }}
    >
      {name}
    </Button>
  );
};

export const Actions = ({
  bulkId,
  setError,
}: {
  bulkId: string;
  setError: (data: {
    code: number;
    message: string;
    [key: string]: any;
  }) => void;
}) => {
  const [actions, setActions] = useState<
    {
      label: string;
      value: string;
    }[]
  >([]);
  const [innerError, setInnerError] = useState<string>("");

  useEffect(() => {
    const requester = async () => {
      const httpClient = new HttpClient();
      const response:
        | {
            code: number;
            message: string;
            data: ApiInputType[];
          }
        | false = await httpClient.get(`/change/payment/bulk`);

      if (!response) {
        setInnerError(
          httpClient?.error?.message ||
            "aucune action disponible pour le moment"
        );
        return;
      }

      response.data?.forEach((field) => {
        if (
          field.property === "validationAction" &&
          Array.isArray(field.options)
        ) {
          setActions(
            field.options.map((option) => ({
              label: String(option.label),
              value: String(option.value),
            }))
          );
        }
      });
    };

    requester();
  }, []);

  return (
    <div className="flex justify-end gap-5">
      {innerError}
      {actions &&
        actions.map((action) => (
          <ActionButton
            key={action.label}
            name={action.label}
            bulkId={bulkId}
            value={action.value}
            setError={setError}
          />
        ))}
    </div>
  );
};

export const AgentCard = (props: InnerAgentData) => {
  return (
    <div className="flex gap-5 items-center max-lg:flex-cols">
      <div className="rounded-xl overflow-hidden border-primary border-2 max-md:hidden ">
        {props.photo && props.photo !== null ? (
          <ImageWithFallback
            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${
              props.photo[1] == "/" ? "" : "/"
            }${props.photo}`}
            alt="agent images"
            className=""
            width={50}
            height={50}
          />
        ) : (
          <FaUserGraduate size={50} className="m-2.5" />
        )}
      </div>
      <ul>
        <li>
          nom : <strong>{props.firstName}</strong>
        </li>
        <li>
          post-nom : <strong>{props.lastName}</strong>
        </li>
        <li>
          Au :{" "}
          <strong>
            {new Date(props.operationCreatedDate).toLocaleString("fr")}
          </strong>
        </li>
      </ul>
    </div>
  );
};

export const StatCard = (props: { label: string; number: number }) => {
  return (
    <div className="w-fit flex flex-col gap-3">
      <span className="block ">{props.label}</span>
      <span className="block text-2xl font-semibold">{props.number}</span>
    </div>
  );
};
