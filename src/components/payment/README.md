# Payment Module

Module de paiement complet et production-ready pour Next.js + Tailwind CSS.

## 📁 Structure

```
/components/payment/
├── PaymentWizard.tsx          # Composant principal du wizard
├── WizardHeader.tsx           # En-tête avec stepper (4 étapes)
├── PaymentContainer.tsx       # Container avec layout 2 colonnes
├── PaymentMethodSelector.tsx  # Sélecteur de méthode (colonne gauche)
├── PaymentForms/
│   ├── EasyPayForm.tsx       # Formulaire EasyPay
│   └── OtherPaymentForm.tsx  # Formulaire upload preuve
└── index.ts                  # Exports

/store/
└── paymentStore.ts           # Store Zustand pour l'état

/hooks/
├── usePaymentSubmit.ts       # Hook pour soumettre paiement EasyPay
├── useUploadProof.ts         # Hook pour uploader preuve
└── useAmount.ts              # Hook pour récupérer le montant
```

## 🚀 Utilisation

### Exemple basique

```tsx
import PaymentWizard from "@/components/payment/PaymentWizard";

export default function PaymentPage() {
  return (
    <PaymentWizard
      operationId="123"
      defaultAmount={50000}
      onSuccess={() => console.log("Paiement réussi!")}
    />
  );
}
```

### Avec query params

```tsx
import { useSearchParams } from "next/navigation";
import PaymentWizard from "@/components/payment/PaymentWizard";

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const operationId = searchParams.get("operationId");

  return (
    <PaymentWizard
      operationId={operationId || undefined}
      defaultAmount={50000}
    />
  );
}
```

## 🎯 Fonctionnalités

### Wizard en 4 étapes

1. **Panier** - Contenu du panier (à personnaliser)
2. **Adresse** - Formulaire d'adresse (à personnaliser)
3. **Paiement** - Sélection méthode + formulaire dynamique
4. **Confirmation** - Récapitulatif avant soumission

### Méthodes de paiement

#### EasyPay

- Formulaire standard (Nom, Email, Téléphone, Montant)
- Validation en temps réel
- Icônes de validation visuelles

#### Autre (Upload)

- Upload de preuve (Image ou PDF)
- Référence de transaction
- Notes optionnelles

## 🔧 Configuration

### Store Zustand

Le store `usePaymentStore` gère :

- État du wizard (`currentStep`)
- Méthode sélectionnée (`paymentMethod`)
- Données des formulaires (`formEasyPay`, `formOther`)
- Validation (`isValid`)

### Hooks TanStack Query

- `usePaymentSubmit()` - Soumet un paiement EasyPay
- `useUploadProof()` - Upload une preuve de paiement
- `useAmount(operationId?)` - Récupère le montant depuis l'API

## 🎨 Personnalisation

### Styles Tailwind

Tous les composants utilisent Tailwind CSS avec :

- Couleurs pastel douces
- Ombres légères
- Bordures arrondies
- Transitions fluides

### Modifier les étapes

Dans `PaymentWizard.tsx`, personnalisez le contenu des étapes 0 et 1 :

```tsx
{
  currentStep === 0 && <div>Votre contenu panier</div>;
}

{
  currentStep === 1 && <div>Votre formulaire d'adresse</div>;
}
```

## 🔌 Intégration API

### Endpoints à configurer

Dans les hooks, remplacez les URLs placeholder :

- `usePaymentSubmit.ts` : `/payments/easypay`
- `useUploadProof.ts` : `/payments/upload-proof`
- `useAmount.ts` : `/payments/amount`

### Format des réponses

```typescript
// PaymentSubmitResponse
{
  success: boolean;
  transactionId?: string;
  message?: string;
}

// UploadProofResponse
{
  success: boolean;
  proofId?: string;
  message?: string;
}

// AmountResponse
{
  amount: number;
  currency: string;
  operationId?: string;
}
```

## ✅ Validation

- **EasyPay** : Nom, Email valide, Téléphone, Montant > 0
- **Other** : Fichier uploadé, Référence remplie

La validation est automatique et mise à jour en temps réel via le store Zustand.

## 📝 Notes

- Le module est entièrement typé avec TypeScript
- Tous les composants sont "use client" (Next.js 13+)
- Le store utilise Zustand avec devtools pour le debugging
- Les hooks utilisent TanStack Query pour le cache et la gestion d'erreurs
