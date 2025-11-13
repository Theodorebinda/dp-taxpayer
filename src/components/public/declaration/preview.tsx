import { FormStep, FormData } from "./types";

// ============================================
// UTILITAIRES
// ============================================

/**
 * Vérifie si une valeur est un objet (et non null, array, etc.)
 */
const isObject = (value: any): boolean => {
  return value !== null && typeof value === "object" && !Array.isArray(value);
};

/**
 * Composant pour afficher une valeur (simple ou objet imbriqué)
 */
const ValueDisplay: React.FC<{
  value: any;
  level?: number;
}> = ({ value, level = 0 }) => {
  // Si c'est un objet, afficher les propriétés imbriquées
  if (isObject(value)) {
    return (
      <div
        className={`space-y-2 ${
          level > 0 ? "pl-4 border-l-2 border-border/30" : ""
        }`}
      >
        {Object.entries(value).map(([key, val]) => (
          <div key={key} className="space-y-1">
            <div className="text-muted-foreground capitalize">
              {key.replace(/([A-Z])/g, " $1").trim()}
            </div>
            <ValueDisplay value={val} level={level + 1} />
          </div>
        ))}
      </div>
    );
  }

  // Si c'est un tableau
  if (Array.isArray(value)) {
    return (
      <div
        className={`space-y-2 ${
          level > 0 ? "pl-4 border-l-2 border-red-500" : ""
        }`}
      >
        {value.map((item, index) => (
          <div key={index} className="space-y-1 pl-4">
            <div className="text-muted-foreground font-normal">
              Votre bien N° {index + 1}
            </div>
            <ValueDisplay value={item} level={level + 1} />
          </div>
        ))}
      </div>
    );
  }

  // Valeur simple
  return (
    <div className="font-medium text-foreground">
      {value?.toString() || "-"}
    </div>
  );
};

// ============================================
// COMPOSANT: PreviewSection
// ============================================

export const PreviewSection: React.FC<{
  formSteps: FormStep[];
  formData: FormData;
}> = ({ formSteps, formData }) => (
  <div className="lg:col-span-1">
    <div className="bg-background rounded-2xl p-6 shadow-sm sticky top-10">
      <h3 className="text-lg font-semibold mb-6">Récapitulatif</h3>

      {/* QR Code */}
      <div className="flex justify-center mb-6">
        <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
          <div className="text-center text-sm text-muted-foreground">
            QR Code
          </div>
        </div>
      </div>

      <p className=" text-center text-primary mb-6">
        Scannez pour importer sur votre mobile
      </p>

      {/* Données saisies */}
      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {formSteps?.map((config) => {
          const values = config.fields.map((field) => ({
            value: formData?.[config.property]?.[field.property],
            verbose: field.verbose,
            property: field.property,
          }));

          // Vérifier s'il y a au moins une valeur non vide
          const hasValues = values.some(
            (field) =>
              field.value !== undefined &&
              field.value !== null &&
              field.value !== ""
          );

          if (!hasValues) return null;

          return (
            <div key={config.id || config.title} className="space-y-3">
              <div className="font-semibold text-foreground mb-2 pb-2 border-b-2 border-primary/20">
                {config.title}
              </div>
              <div className="pl-3 space-y-3">
                {values.map((field) => {
                  if (
                    field.value === undefined ||
                    field.value === null ||
                    field.value === ""
                  )
                    return null;

                  return (
                    <div
                      className="pb-3 border-b border-border/30 last:border-0"
                      key={config.title + field.verbose}
                    >
                      <span className="font-medium  text-muted-foreground block mb-1">
                        {field.verbose}
                      </span>
                      <ValueDisplay value={field.value} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {Object.keys(formData).length === 0 && (
          <div className="text-center text-muted-foreground  py-8">
            Les informations saisies apparaîtront ici
          </div>
        )}
      </div>

      {Object.keys(formData).length > 0 && (
        <button className="w-full mt-6 px-4 py-3 border border-border rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-2">
          <span>📥</span>
          Télécharger
        </button>
      )}
    </div>
  </div>
);

export const ReviewStep: React.FC<{
  formSteps: FormStep[];
  formData: FormData;
  onEdit: (stepIndex: number) => void;
}> = ({ formSteps, formData, onEdit }) => (
  <div className="space-y-6">
    <div className="text-center mb-8">
      <h3 className="text-2xl font-bold mb-2">Vérifiez vos informations</h3>
      <p className="text-muted-foreground">
        Vérifiez toutes les informations avant de soumettre votre déclaration
      </p>
    </div>

    <div className="space-y-6">
      {formSteps.map((step, stepIndex) => {
        // Vérifier s'il y a des données pour cette étape
        const hasData = step.fields.some((field) => {
          const value = formData?.[step.property]?.[field.property];
          return value !== undefined && value !== null && value !== "";
        });

        if (!hasData) return null;

        return (
          <div
            key={step.id}
            className="bg-muted/30 rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">{step.title}</h4>
              <button
                onClick={() => onEdit(stepIndex)}
                className="text-primary hover:underline font-medium hover:bg-primary/10 px-3 py-1 rounded-lg transition-all"
              >
                Modifier
              </button>
            </div>

            <div className="space-y-4">
              {step.fields.map((field) => {
                const value = formData?.[step.property]?.[field.property];
                if (value === undefined || value === null || value === "")
                  return null;

                return (
                  <div
                    key={field.property}
                    className="bg-background/50 rounded-lg p-4"
                  >
                    <div className="text-muted-foreground mb-2">
                      {field.verbose} :
                    </div>
                    <ValueDisplay value={value} />
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ============================================
// COMPOSANT BONUS: NestedObjectDisplay
// Version alternative avec un style plus compact
// ============================================

export const NestedObjectDisplay: React.FC<{
  data: any;
  title?: string;
  level?: number;
}> = ({ data, title, level = 0 }) => {
  const indent = level * 16;

  if (isObject(data)) {
    return (
      <div style={{ marginLeft: `${indent}px` }} className="space-y-2">
        {title && <div className="font-medium text-primary">{title}</div>}
        {Object.entries(data).map(([key, value]) => (
          <NestedObjectDisplay
            key={key}
            data={value}
            title={key.replace(/([A-Z])/g, " $1").trim()}
            level={level + 1}
          />
        ))}
      </div>
    );
  }

  if (Array.isArray(data)) {
    return (
      <div style={{ marginLeft: `${indent}px` }} className="space-y-2">
        {title && <div className="font-medium text-primary">{title}</div>}
        {data.map((item, index) => (
          <NestedObjectDisplay
            key={index}
            data={item}
            title={`${index + 1}`}
            level={level + 1}
          />
        ))}
      </div>
    );
  }

  return (
    <div style={{ marginLeft: `${indent}px` }} className="flex gap-2">
      {title && <span className=" text-muted-foreground">{title}:</span>}
      <span className="font-medium">{data?.toString() || "-"}</span>
    </div>
  );
};
