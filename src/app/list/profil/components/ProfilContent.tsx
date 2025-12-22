"use client";

import type { TaxpayerAccount } from "@/types/taxpayer-account.type";
import { useTaxpayer, useUpdateTaxpayer } from "@/hooks/useTaxpayer";
import profilImage from "@/../public/images/profil.png";
import Loader from "@/components/atoms/loader";
import toast from "react-hot-toast";
import { Button, Accordion } from "@/components/ui";
import Dialog from "@/components/atoms/dialog";
import Link from "next/link";
import {
  ArrowLeft,
  Phone,
  Calendar,
  User,
  Edit2,
  ArrowRight,
  Camera,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { formatDateForInput } from "@/utils/utils";
import Image from "next/image";
import { objectToFormData } from "@/components/form/utils";

type ProfilContentProps = {
  initialData: TaxpayerAccount | null;
  taxpayerId: string;
};

export default function ProfilContent({
  initialData,
  taxpayerId,
}: ProfilContentProps) {
  const {
    data: taxpayer,
    isLoading,
    isError,
    refetch,
  } = useTaxpayer(taxpayerId);

  const updateTaxpayerMutation = useUpdateTaxpayer(taxpayerId);

  const taxpayerData =
    taxpayer && typeof taxpayer === "object" ? taxpayer : initialData;

  console.log("taxpayerData", taxpayerData);

  // États pour les modals
  const [isIdentityModalOpen, setIsIdentityModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSystemModalOpen, setIsSystemModalOpen] = useState(false);

  // États pour les formulaires
  const [identityForm, setIdentityForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    birthDate: "",
    birthPlace: "",
    sex: "",
    martialStatus: "",
  });

  const [contactForm, setContactForm] = useState({
    mobile: "",
    email: "",
    physicalAddress: "",
    identityCard: "",
    identityCardNumber: "",
  });

  const [systemForm, setSystemForm] = useState({
    approvalStatus: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState<File | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setSelectedPhotoFile(file);
      };
      reader.onerror = () => {
        toast.error("Erreur lors de la lecture de l'image");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelPhoto = () => {
    setPhotoPreview(null);
    setSelectedPhotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleValidatePhoto = async () => {
    if (!selectedPhotoFile) {
      toast.error("Aucune photo sélectionnée");
      return;
    }

    try {
      const payload = {
        user: {
          photo: selectedPhotoFile,
        },
      };

      const formData = objectToFormData(payload);

      await updateTaxpayerMutation.mutateAsync(formData);

      toast.success("Photo mise à jour avec succès");

      setPhotoPreview(null);
      setSelectedPhotoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erreur lors de l'upload de la photo"
      );
    }
  };

  // Fonctions pour ouvrir les modals et initialiser les formulaires
  const openIdentityModal = () => {
    if (taxpayerData) {
      setIdentityForm({
        firstName: taxpayerData.firstName || "",
        lastName: taxpayerData.lastName || "",
        middleName: taxpayerData.middleName || "",
        birthDate: formatDateForInput(taxpayerData.birthDate),
        birthPlace: taxpayerData.birthPlace || "",
        sex: taxpayerData.sex || "",
        martialStatus: taxpayerData.martialStatus || "",
      });
    }
    setIsIdentityModalOpen(true);
  };

  const openContactModal = () => {
    if (taxpayerData) {
      setContactForm({
        mobile: taxpayerData.mobile || "",
        email: taxpayerData.email || "",
        physicalAddress: taxpayerData.physicalAddress || "",
        identityCard: taxpayerData.identityCard || "",
        identityCardNumber: taxpayerData.identityCardNumber || "",
      });
    }
    setIsContactModalOpen(true);
  };

  const openSystemModal = () => {
    if (taxpayerData) {
      setSystemForm({
        approvalStatus: taxpayerData.approvalStatus || "",
      });
    }
    setIsSystemModalOpen(true);
  };

  if (isLoading && !initialData) {
    return <Loader />;
  }

  if (isError || (!taxpayerData && !isLoading)) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-4 text-red-600 dark:border-red-900/60 dark:bg-red-950/40">
          <p className="font-semibold">Erreur de chargement</p>
          <p className="text-sm">
            Impossible de charger les informations du contribuable.
          </p>
        </div>
      </section>
    );
  }

  if (!taxpayerData) {
    return (
      <section className="flex flex-col gap-3 p-0 md:p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-6 py-4 text-yellow-600 dark:border-yellow-900/60 dark:bg-yellow-950/40">
          <p className="font-semibold">Aucune donnée disponible</p>
          <p className="text-sm">
            Les informations du contribuable ne sont pas disponibles.
          </p>
        </div>
      </section>
    );
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // console.log("taxpayerData.photo", taxpayerData.user?.photo);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6 p-0 md:p-6"
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/list/overview">
                <Button variant="outline" size="small">
                  <ArrowLeft className="size-4" />
                  Retour
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                size="small"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                Actualiser
              </Button>
            </motion.div>
          </div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-3xl font-semibold">
              {taxpayerData.fullName || "N/A"}
            </h1>
            <p className="text-sm text-muted-foreground">
              Vos informations détaillées
            </p>
          </motion.div>
        </div>

        <div className="relative flex flex-col lg:flex-row gap-6 items-center w-full lg:justify-between justify-center lg:h-[calc(70vh-100px)]">
          {/* Photo de profil fixe à gauche */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:shrink-0 flex justify-center"
          >
            <div className="lg:sticky lg:top-6 lg:self-start">
              <motion.div
                className="flex flex-col items-center gap-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative">
                  <div className="mx-4 lg:mx-0 size-96 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-primary/20 overflow-hidden">
                    <Image
                      src={
                        photoPreview ||
                        taxpayerData.user?.photo ||
                        profilImage.src
                      }
                      alt="Photo de profil"
                      width={200}
                      height={200}
                      className="object-cover rounded-full"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => {
                      fileInputRef.current?.click();
                    }}
                    className="absolute bottom-2 right-2 lg:bottom-4 lg:right-4 size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors border-2 border-background z-10"
                    title="Modifier la photo de profil"
                  >
                    <Camera className="size-5" />
                  </motion.button>

                  {/* Boutons Annuler et Valider - affichés uniquement si une photo est sélectionnée */}
                  {photoPreview && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex gap-3 z-10"
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="button"
                          variant="secondary"
                          size="small"
                          onClick={handleCancelPhoto}
                          className="px-4 py-2"
                        >
                          Annuler
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button
                          type="button"
                          variant="primary"
                          size="small"
                          onClick={handleValidatePhoto}
                          className="px-4 py-2"
                        >
                          Valider
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex-1 min-w-0 w-full lg:w-auto max-w-2xl"
          >
            <div className="w-full mx-auto">
              <Accordion
                items={[
                  {
                    title: "Identité",
                    icon: <User className="size-5" />,
                    defaultOpen: true,
                    children: (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Nom complet
                          </span>
                          <span className="text-base font-medium text-foreground">
                            {taxpayerData.fullName || "N/A"}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Prénom
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.firstName || "N/A"}
                            </span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Nom
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.lastName || "N/A"}
                            </span>
                          </div>
                        </div>
                        {taxpayerData.middleName && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Nom du milieu
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.middleName}
                            </span>
                          </div>
                        )}
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Identifiant unique (NIF)
                          </span>
                          <span className="text-base font-medium text-foreground">
                            {taxpayerData.uniqueId || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Catégorie
                          </span>
                          <span className="text-base font-medium text-foreground">
                            {taxpayerData.category === "PHYSIQUE"
                              ? "Personne physique"
                              : taxpayerData.category === "MORALE"
                              ? "Personne morale"
                              : taxpayerData.category || "N/A"}
                          </span>
                        </div>
                        {taxpayerData.birthDate && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Date de naissance
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.birthDate}
                            </span>
                          </div>
                        )}
                        {taxpayerData.birthPlace && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Lieu de naissance
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.birthPlace}
                            </span>
                          </div>
                        )}
                        {taxpayerData.sex && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Sexe
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.sex}
                            </span>
                          </div>
                        )}
                        {taxpayerData.martialStatus && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Statut matrimonial
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.martialStatus}
                            </span>
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="pt-4 w-fit self-end"
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              size="small"
                              className="w-full px-4 py-2"
                              onClick={openIdentityModal}
                            >
                              <Edit2 className="size-4 mr-2" />
                              Mettre à jour
                            </Button>
                          </motion.div>
                        </motion.div>
                      </div>
                    ),
                  },
                  {
                    title: "Contact",
                    icon: <Phone className="size-5" />,
                    children: (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Téléphone mobile
                          </span>
                          <span className="text-base font-medium text-foreground">
                            {taxpayerData.mobile || "N/A"}
                          </span>
                        </div>
                        {taxpayerData.email && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Email
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.email}
                            </span>
                          </div>
                        )}
                        {taxpayerData.physicalAddress && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Adresse physique
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.physicalAddress}
                            </span>
                          </div>
                        )}
                        {taxpayerData.identityCard && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Type de pièce d&apos;identité
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.identityCard}
                            </span>
                          </div>
                        )}
                        {taxpayerData.identityCardNumber && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">
                              Numéro de pièce d&apos;identité
                            </span>
                            <span className="text-base font-medium text-foreground">
                              {taxpayerData.identityCardNumber}
                            </span>
                          </div>
                        )}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className="pt-4 w-fit self-end"
                        >
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              size="small"
                              className="w-full px-4 py-2"
                              onClick={openContactModal}
                            >
                              <Edit2 className="size-4 mr-2" />
                              Mettre à jour
                            </Button>
                          </motion.div>
                        </motion.div>
                      </div>
                    ),
                  },
                  {
                    title: "Informations système",
                    icon: <Calendar className="size-5" />,
                    children: (
                      <div className="space-y-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Statut d&apos;approbation
                          </span>
                          <span className="text-base font-medium text-foreground">
                            {taxpayerData.approvalStatus || "N/A"}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Date de création
                          </span>
                          <span className="text-base font-medium text-foreground">
                            {formatDateTime(taxpayerData.createdAt)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            Dernière mise à jour
                          </span>
                          <span className="text-base font-medium text-foreground">
                            {formatDateTime(taxpayerData.updatedAt)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-xs uppercase tracking-wide text-muted-foreground">
                            ID du contribuable
                          </span>
                          <span className="text-sm font-mono text-foreground/70">
                            {taxpayerData.id}
                          </span>
                        </div>
                      </div>
                    ),
                  },
                ]}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full flex justify-end mt-8"
            >
              <motion.div
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outline"
                  size="small"
                  className="px-4 py-3"
                  onClick={() => {
                    // router.push("/list/property");
                    console.log("Voir vos Biens");
                  }}
                >
                  Voir vos Biens{" "}
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                    className="inline-block"
                  >
                    <ArrowRight className="size-4 ml-2" />
                  </motion.span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Modal Identité */}
      <Dialog
        isOpen={isIdentityModalOpen}
        onClose={() => setIsIdentityModalOpen(false)}
        title="Modifier l'identité"
        size="lg"
        variant="default"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await updateTaxpayerMutation.mutateAsync(identityForm);
              toast.success("Informations d'identité mises à jour avec succès");
              setIsIdentityModalOpen(false);
              refetch();
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Erreur lors de la mise à jour"
              );
            }
          }}
          className="space-y-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Prénom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={identityForm.firstName}
                onChange={(e) =>
                  setIdentityForm({
                    ...identityForm,
                    firstName: e.target.value,
                  })
                }
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Nom <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={identityForm.lastName}
                onChange={(e) =>
                  setIdentityForm({ ...identityForm, lastName: e.target.value })
                }
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Nom du milieu
            </label>
            <input
              type="text"
              value={identityForm.middleName}
              onChange={(e) =>
                setIdentityForm({ ...identityForm, middleName: e.target.value })
              }
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Date de naissance
            </label>
            <input
              type="date"
              value={identityForm.birthDate || ""}
              onChange={(e) =>
                setIdentityForm({
                  ...identityForm,
                  birthDate: e.target.value,
                })
              }
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Lieu de naissance
            </label>
            <input
              type="text"
              value={identityForm.birthPlace}
              onChange={(e) =>
                setIdentityForm({ ...identityForm, birthPlace: e.target.value })
              }
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Sexe
              </label>
              <select
                value={identityForm.sex}
                onChange={(e) =>
                  setIdentityForm({ ...identityForm, sex: e.target.value })
                }
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sélectionner</option>
                <option value="HOMME">Masculin</option>
                <option value="Femme">Féminin</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Statut matrimonial
              </label>
              <select
                value={identityForm.martialStatus}
                onChange={(e) =>
                  setIdentityForm({
                    ...identityForm,
                    martialStatus: e.target.value,
                  })
                }
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sélectionner</option>
                <option value="Célibataire">Célibataire</option>
                <option value="Marié(e)">Marié(e)</option>
                <option value="Divorcé(e)">Divorcé(e)</option>
                <option value="Veuf(ve)">Veuf(ve)</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsIdentityModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={updateTaxpayerMutation.isPending}
            >
              {updateTaxpayerMutation.isPending
                ? "Enregistrement..."
                : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Modal Contact */}
      <Dialog
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Modifier les informations de contact"
        size="lg"
        variant="default"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await updateTaxpayerMutation.mutateAsync(contactForm);
              toast.success("Informations de contact mises à jour avec succès");
              setIsContactModalOpen(false);
              refetch();
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Erreur lors de la mise à jour"
              );
            }
          }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Téléphone mobile <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={contactForm.mobile}
              onChange={(e) =>
                setContactForm({ ...contactForm, mobile: e.target.value })
              }
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Email</label>
            <input
              type="email"
              value={contactForm.email || ""}
              onChange={(e) =>
                setContactForm({ ...contactForm, email: e.target.value })
              }
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Adresse physique
            </label>
            <textarea
              value={contactForm.physicalAddress || ""}
              onChange={(e) =>
                setContactForm({
                  ...contactForm,
                  physicalAddress: e.target.value,
                })
              }
              rows={3}
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Type de pièce d&apos;identité
              </label>
              <select
                value={contactForm.identityCard || ""}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    identityCard: e.target.value,
                  })
                }
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sélectionner</option>
                <option value="Carte d'identité">Carte d&apos;identité</option>
                <option value="Passeport">Passeport</option>
                <option value="Permis de conduire">Permis de conduire</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Numéro de pièce d&apos;identité
              </label>
              <input
                type="text"
                value={contactForm.identityCardNumber || ""}
                onChange={(e) =>
                  setContactForm({
                    ...contactForm,
                    identityCardNumber: e.target.value,
                  })
                }
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsContactModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={updateTaxpayerMutation.isPending}
            >
              {updateTaxpayerMutation.isPending
                ? "Enregistrement..."
                : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Modal Informations système */}
      {/* <Dialog
        isOpen={isSystemModalOpen}
        onClose={() => setIsSystemModalOpen(false)}
        title="Modifier les informations système"
        size="md"
        variant="default"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await updateTaxpayerMutation.mutateAsync(systemForm);
              toast.success("Informations système mises à jour avec succès");
              setIsSystemModalOpen(false);
              refetch();
            } catch (error) {
              toast.error(
                error instanceof Error
                  ? error.message
                  : "Erreur lors de la mise à jour"
              );
            }
          }}
          className="space-y-4"
        >
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">
              Statut d&apos;approbation
            </label>
            <select
              value={systemForm.approvalStatus}
              onChange={(e) =>
                setSystemForm({
                  ...systemForm,
                  approvalStatus: e.target.value,
                })
              }
              className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionner</option>
              <option value="APPROVED">Approuvé</option>
              <option value="PENDING">En attente</option>
              <option value="REJECTED">Rejeté</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsSystemModalOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={updateTaxpayerMutation.isPending}
            >
              {updateTaxpayerMutation.isPending
                ? "Enregistrement..."
                : "Enregistrer"}
            </Button>
          </div>
        </form>
      </Dialog>
       */}
    </motion.section>
  );
}
