import React, { useState } from "react";
import Button from "./button";
import { useStore } from "zustand";
import { connectedUserStore } from "../store/connectedUser";
import HttpClient from "@/utils/http-client";
import { IoPencilOutline } from "react-icons/io5";
import {
  LuAArrowDown,
  LuAArrowUp,
  LuChevronDown,
  LuChevronUp,
  LuPen,
} from "react-icons/lu";

export type QuickApprovalInfo = {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "SKIPPED" | "IN_PROGRESS";
  model: {
    id: string;
    name: string;
  };
  approvals: {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "SKIPPED";
    comment: string | null;
    user: {
      id: string;
      mail: string;
    };
  }[];
};

type Props = {
  data: QuickApprovalInfo;
  postUrl: string;
  onValidate?: (
    validationId: string,
    action: "APPROVED" | "REJECTED",
    comment?: string
  ) => void;
};

type StatusBadgeProps = {
  status: "PENDING" | "APPROVED" | "REJECTED" | "SKIPPED" | "IN_PROGRESS";
};

const statusColors: Record<StatusBadgeProps["status"], string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
  SKIPPED: "bg-gray-100 text-gray-600",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => (
  <span className={`px-3 py-1 text-sm rounded ${statusColors[status]}`}>
    {status}
  </span>
);

const QuickApprovalValidation: React.FC<Props> = ({
  data,
  onValidate,
  postUrl,
}) => {
  const [validations, setValidations] = useState(data.approvals);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedValidationId, setSelectedValidationId] = useState<
    string | null
  >(null);
  const [selectedStatus, setSelectedStatus] = useState<"APPROVED" | "REJECTED">(
    "APPROVED"
  );
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useStore(connectedUserStore);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const openModal = (validationId: string) => {
    setSelectedValidationId(validationId);
    setSelectedStatus("APPROVED");
    setComment("");
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowSuccess(false);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    if (!selectedValidationId) return;

    const httpClient = new HttpClient();
    const response: {
      code: number;
      message: string;
      data?: Record<string, any>;
    }| false = await httpClient.patch(postUrl, {
      status: selectedStatus,
      comment: comment || null,
    });

    if (!response) {
      setErrorMessage(httpClient.error?.message || "Erreur inconnue.");
      return;
    }

    const updated = validations.map((v) =>
      v.id === selectedValidationId
        ? { ...v, status: selectedStatus, comment }
        : v
    );

    setValidations(updated);
    setSuccessMessage(
      response.message || "Validation enregistrée avec succès."
    );
    setShowSuccess(true);
    onValidate?.(selectedValidationId, selectedStatus, comment);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedValidationId(null);
    setComment("");
    setErrorMessage(null);
    setShowSuccess(false);
    setSuccessMessage(null);
  };

  return (
    <div className="p-4 rounded-lg bg-app-green-300 dark:bg-app-blue-600 space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4 max-md:">
          <h2 className="font-semibold">Validation disponible</h2>
          <StatusBadge status={data.status} />
        </div>
        <button onClick={toggleCollapse} className="">
          {isCollapsed ? (
            <LuChevronDown size={25} />
          ) : (
            <LuChevronUp size={25} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
          <div className="space-y-2">
            {validations?.map((validation) => (
              <div
                key={validation.id}
                className="flex justify-between items-center p-2 rounded bg-bg-secondary "
              >
                <div className="flex items-center gap-5">
                  <div className="w-full">
                    <div className="font-medium max-md:text-wrap">
                      {validation.user.mail}
                    </div>
                    <span className="text-sm">
                      <span className="font-normal">commentaire :</span>{" "}
                      {validation.comment}
                    </span>
                  </div>
                </div>

                {user?.id === validation.user.id &&
                validation.status === "PENDING" ? (
                  <Button
                    variant="primary"
                    onClick={() => openModal(validation.id)}
                  >
                    <span className="max-lg:hidden">Valider</span>
                    <span className="lg:hidden">
                      <LuPen />{" "}
                    </span>
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <StatusBadge status={validation.status} />
                    {validation.status === "REJECTED" && (
                      <span
                        className="cursor-pointer"
                        onClick={() => openModal(validation.id)}
                      >
                        <IoPencilOutline size={20} />
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-foreground/40 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md text-center">
            {showSuccess ? (
              <div>
                <div className="flex justify-center mb-4">
                  <svg
                    className="w-16 h-16 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <p className="text-green-700 font-medium mb-4">
                  {successMessage}
                </p>
                <Button variant="primary" onClick={handleCloseModal}>
                  Fermer
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4">Validation</h3>

                {errorMessage && (
                  <div className="text-red-600">{errorMessage}</div>
                )}

                <label className="block font-medium">Statut</label>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as "APPROVED" | "REJECTED")
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                >
                  <option value="APPROVED">Approuvé</option>
                  <option value="REJECTED">Rejeté</option>
                </select>

                <label className="block mb-2 font-medium">Commentaire</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4"
                  rows={4}
                  placeholder="Ajoutez un commentaire (optionnel)"
                />

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={handleCloseModal}>
                    Annuler
                  </Button>
                  <Button variant="success" onClick={handleConfirm}>
                    Confirmer
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickApprovalValidation;
