import React, { useState } from "react";
import { IoFilterOutline } from "react-icons/io5";
import Modal from "@/components/atoms/modal";
import Button from "@/components/commons/button";

export type FilterOptionColumnType = {
  property: string;
  verbose: string;
  type: "text" | "number" | "boolean" | "enum" | "date";
  options?: {
    label: string;
    value: string;
  }[];
};

type Props = {
  active: boolean;
  fields: FilterOptionColumnType[];
  onSubmit: (filters: Record<string, any>) => void;
};

const FilterForm: React.FC<Props> = ({ active, fields, onSubmit }) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formState, setFormState] = useState<Record<string, any>>({});

  const handleChange = (key: string, value: any) => {
    setFormState((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDateChange = (key: string, field: string, value: string) => {
    setFormState((prev: any) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
    setIsModalOpen(false); // Ferme le modal après soumission
  };

  return (
    <>
      {/* Bouton pour ouvrir le modal */}
      <Button
        type="button"
        onClick={() => setIsModalOpen(true)}
        disabled={!active}
        className="py-3 px-5 rounded-full! max-lg:w-full"
      >
        <IoFilterOutline size={15} />
        <span className="max-md:hidden">Filtres</span>
      </Button>

      {/* Le modal qui contient le formulaire */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Appliquer les filtres"
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5 bg-background p-2 min-w-96 h-fit rounded-xl"
        >
          {fields.map((field) => (
            <div key={field.property} className="flex flex-col">
              <label className="font-medium mb-1">{field.verbose}</label>

              {field.type === "text" && (
                <input
                  type="text"
                  className="bg-background border border-foreground px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-app-green-500"
                  onChange={(e) => handleChange(field.property, e.target.value)}
                  value={formState[field.property] || ""}
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  className="bg-background border border-foreground px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-app-green-500"
                  onChange={(e) =>
                    handleChange(field.property, Number(e.target.value))
                  }
                  value={formState[field.property] || ""}
                />
              )}

              {field.type === "boolean" && (
                <select
                  className="bg-background border border-foreground px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-app-green-500"
                  onChange={(e) =>
                    handleChange(field.property, e.target.value === "true")
                  }
                  value={
                    formState[field.property] === true
                      ? "true"
                      : formState[field.property] === false
                      ? "false"
                      : ""
                  }
                >
                  <option value="">-- Choisir --</option>
                  <option value="true">Oui</option>
                  <option value="false">Non</option>
                </select>
              )}

              {field.type === "enum" && (
                <select
                  className="bg-background border border-foreground px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-app-green-500"
                  onChange={(e) => handleChange(field.property, e.target.value)}
                  value={formState[field.property] || ""}
                >
                  <option value="">-- Choisir --</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "date" && (
                <div className="flex gap-2 items-center flex-col w-full">
                  <input
                    type="date"
                    className="bg-background border border-foreground px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-app-green-500"
                    onChange={(e) =>
                      handleDateChange(field.property, "start", e.target.value)
                    }
                    value={formState[field.property]?.start || ""}
                  />
                  <span className="text-gray-500 text-sm">à</span>
                  <input
                    type="date"
                    className="bg-background border border-foreground px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-app-green-500"
                    onChange={(e) =>
                      handleDateChange(field.property, "end", e.target.value)
                    }
                    value={formState[field.property]?.end || ""}
                  />
                </div>
              )}
            </div>
          ))}

          <button
            type="submit"
            className="mt-4 w-full text-center p-3 bg-app-green text-background rounded-xl hover:bg-app-green-700 flex items-center justify-center gap-2 font-semibold"
          >
            Appliquer les filtres
          </button>
        </form>
      </Modal>
    </>
  );
};

export default FilterForm;
