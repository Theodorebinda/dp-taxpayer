import Modal from "@/components/atoms/modal";
import Button from "@/components/commons/button";
import { StepList } from "@/types/recipe-view";
import {
  Building2,
  CalendarClock,
  ChevronRight,
  ExternalLink,
  Hash,
  House,
  ListOrdered,
  Pen,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import BureauSearchModal from "./define-office";

const StepCard = ({
  step,
  index,
  brotherSteps,
}: {
  step: StepList;
  index: number;
  brotherSteps: StepList[];
}) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleAddForm = (stepId: string) => {
    setOpenModal(true);
  };

  return (
    <>
      <div
        className={`border-l-2 border-dashed border-foreground flex flex-col items-start ${""}`}
      >
        <div className="flex items-start gap-4 ml-3 pl-3 w-full">
          <div className="relative z-10 flex-shrink-0">
            <div className="w-12 h-12 absolute right-0 rounded-full bg-green-50 flex items-center justify-center border-2 border-primary">
              <span className="text-primary font-semibold text-lg">
                {step.orderIndex}
              </span>
            </div>
          </div>

          <div className="flex-1 rounded-xl overflow-hidden transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold py-3">{step.name}</h3>
                  <span className="px-2 py-1 bg-primary/20 text-foreground text-xs rounded-md font-mono">
                    {step.nameCode}
                  </span>
                </div>

                <p className="text-md">{step.description}</p>

                <div className="flex items-center gap-4 text-md">
                  <span className="flex items-center gap-3">
                    <Hash size={20} /> Ordre : {step.orderIndex}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-3">
                    <CalendarClock size={20} />
                    Ajoutée le {new Date().toLocaleDateString("fr-FR")}
                  </span>
                </div>

                {step.recipeSteps?.[0]?.office ? (
                  <div className="flex gap-2 items-center">
                    <Building2 size={25} />
                    <span className="">Bureau en charge : </span>
                    <span className="font-semibold text-primary flex gap-3 rounded-lg">
                      {step.recipeSteps?.[0]?.office?.name || "bureau"}
                      <button onClick={() => handleAddForm(step.id)}>
                        <Pen size={20} />
                      </button  >
                    </span>
                  </div>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => handleAddForm(step.id)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Ajouter le bureau en charge
                  </Button>
                )}
              </div>

              <Link
                href={`/change/recipe/step/${step.id}`}
                className="bg-primary/10 rounded-full p-2 hover:bg-primary/20 transition"
              >
                <ExternalLink className="text-primary" />
              </Link>
            </div>
          </div>
        </div>
        {step.children && step.children.length > 0 && (
          <div className="pl-16 mt-4 space-y-3 w-full">
            {step.children.map((child, childIndex) => (
              <StepCard
                key={child.id}
                step={child}
                index={childIndex}
                brotherSteps={step.children}
              />
            ))}
          </div>
        )}
      </div>
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <BureauSearchModal
          allSteps={brotherSteps}
          initialStepId={step.id}
          onClose={() => setOpenModal(false)}
        />
      </Modal>
    </>
  );
};

export default StepCard;
