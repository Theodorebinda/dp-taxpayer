import { useState, useEffect } from "react";
import {
  Search,
  Building2,
  Mail,
  Phone,
  MapPin,
  Users,
  ChevronRight,
  ChevronLeft,
  Check,
  Save,
} from "lucide-react";
import { StepList } from "@/types/recipe-view";
import HttpClient from "@/utils/http-client";
import { useParams } from "next/navigation";

interface Office {
  id: string;
  nameCode: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  _count: { agents: number };
}

interface Props {
  allSteps: StepList[];
  initialStepId?: string;
  onClose: () => void;
}

const BureauSearchModal = ({ allSteps, initialStepId, onClose }: Props) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOffices, setSelectedOffices] = useState<Map<string, Office>>(
    new Map()
  );
  const params: { id: string } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [offices, setOffices] = useState<Office[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ code: number; message: string } | null>(
    null
  );

  const sortedSteps = [...allSteps].sort((a, b) => a.orderIndex - b.orderIndex);
  const currentStep = sortedSteps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex >= sortedSteps.length - 1;
  const selectedOffice = selectedOffices.get(currentStep?.id);

  const filteredOffices = offices.filter((office) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      office.name.toLowerCase().includes(term) ||
      office.nameCode.toLowerCase().includes(term) ||
      office.description.toLowerCase().includes(term) ||
      office.address.toLowerCase().includes(term)
    );
  });

  useEffect(() => {
    const initialIndex = sortedSteps.findIndex((s) => s.id === initialStepId);
    setCurrentStepIndex(initialIndex >= 0 ? initialIndex : 0);
  }, [initialStepId]);

  useEffect(() => {
    const fetchOffices = async () => {
      setLoading(true);
      const client = new HttpClient();
      const response: any = await client.get<Office>("list/core/office");
      if (!response) {
        setError(client.error);
        return;
      }
      setOffices(response?.data || []);
      response?.data?.map((office: any) => {
        if (office.id == currentStep.recipeSteps?.[0]?.office?.id) {
          handleSelectOffice(office);
        }
      });
      setLoading(false);
    };
    fetchOffices();
  }, [currentStep]);

  const handleSelectOffice = (office: Office) => {
    const newSelected = new Map(selectedOffices);
    newSelected.set(currentStep.id, office);
    setSelectedOffices(newSelected);
  };

  const handleSave = async () => {
    if (!selectedOffice) return;
    const payload = {
      recipeId: params.id,
      stepId: currentStep.id,
      officeId: selectedOffice.id,
      order: currentStepIndex,
      notes: "note here ",
    };

    const client = new HttpClient();
    const response = await client.post("create/recipe/recipeStep", payload);
    if (!response) {
      setError(client.error);
      return;
    }
    onClose();
  };

  const handlePreviousStep = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
      setSearchTerm("");
    }
  };

  const handleNextStep = () => {
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      setSearchTerm("");
    } else {
      console.log(
        "Associations finales:",
        Array.from(selectedOffices.entries())
      );
      onClose();
    }
  };

  const ProgressBar = () => (
    <div className="flex gap-1 mb-4">
      {sortedSteps.map((step, index) => (
        <div
          key={step.id}
          className={`h-2 flex-1 rounded-full transition-all ${
            index < currentStepIndex
              ? "bg-green-500"
              : index === currentStepIndex
              ? "bg-primary"
              : "bg-secondary"
          }`}
        />
      ))}
    </div>
  );

  const CurrentStepCard = () => (
    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-bold">
            {currentStep?.orderIndex + 1}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">
              {currentStep?.name}
            </h3>
            <span className="px-2 py-0.5 bg-primary/20 text-foreground text-xs rounded font-mono">
              {currentStep?.nameCode}
            </span>
          </div>
          <p className="text-foreground/70 text-sm">
            {currentStep?.description}
          </p>
        </div>
      </div>
    </div>
  );

  const SelectedOfficeBadge = () =>
    selectedOffice ? (
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-foreground">
              Office sélectionné:
            </span>
            <span className="text-sm text-foreground/70">
              {selectedOffice.name}
            </span>
          </div>
          <button
            onClick={() => {
              const newSelected = new Map(selectedOffices);
              newSelected.delete(currentStep.id);
              setSelectedOffices(newSelected);
            }}
            className="text-green-600 hover:text-green-700 text-sm underline"
          >
            Changer
          </button>
        </div>
      </div>
    ) : null;

  const OfficeCard = ({ office }: { office: Office }) => {
    const isSelected = selectedOffice?.id === office.id;
    return (
      <button
        onClick={() => handleSelectOffice(office)}
        className={`w-full text-left rounded-lg p-4 transition-all ${
          isSelected
            ? "bg-primary/10 border-2 border-primary shadow-md"
            : "bg-background border border-foreground/20 hover:border-primary hover:shadow-md"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isSelected ? "bg-primary/20" : "bg-primary/10"
              }`}
            >
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-foreground text-lg">
                  {office.name}
                </h3>
                <span className="px-2 py-0.5 bg-primary/20 text-foreground text-xs rounded font-mono">
                  {office.nameCode}
                </span>
              </div>
              <p className="text-foreground/70 text-sm mb-3">
                {office.description}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-foreground/60">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{office.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span className="truncate">{office.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{office.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>
                    {office._count.agents} agent
                    {office._count.agents > 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {isSelected && (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Check className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
        </div>
      </button>
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 w-full">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Erreur</h3>
          <p className="text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background w-full flex flex-col rounded-xl">
      {/* En-tête */}
      <div className="p-6 border-b border-foreground/20">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Définir les offices en charge
          </h2>
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <span className="font-semibold">
              Étape {currentStepIndex + 1}/{sortedSteps.length}:
            </span>
            <span>{currentStep?.name}</span>
          </div>
        </div>

        <ProgressBar />
        <CurrentStepCard />
        <SelectedOfficeBadge />

        {/* Recherche */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
          <input
            type="text"
            placeholder="Rechercher par nom, code, adresse..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-foreground/20 bg-background text-foreground rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Liste */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
          </div>
        ) : filteredOffices.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-12 h-12 text-foreground/30 mx-auto mb-3" />
            <p className="text-foreground/60 text-lg">Aucun office trouvé</p>
            <p className="text-foreground/40 text-sm mt-1">
              Essayez de modifier votre recherche
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOffices.map((office) => (
              <OfficeCard key={office.id} office={office} />
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-6 border-t border-foreground/20 bg-secondary">
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-3">
            <button
              onClick={handlePreviousStep}
              disabled={isFirstStep}
              className={`flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                !isFirstStep
                  ? "bg-secondary border border-foreground/20 text-foreground hover:bg-foreground/5"
                  : "bg-secondary text-foreground/40 cursor-not-allowed"
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Précédente
            </button>
            <button
              onClick={handleNextStep}
              disabled={isLastStep}
              className="flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all bg-secondary border border-foreground/20 text-foreground hover:bg-foreground/5"
            >
              {isLastStep ? "Terminer" : "Suivante"}
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={!selectedOffice}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
              selectedOffice
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                : "bg-secondary text-foreground/40 cursor-not-allowed"
            }`}
          >
            <Save className="w-5 h-5" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default BureauSearchModal;
