export const qk = {
  taxpayer: {
    registration: () => ["taxpayer", "registration"] as const,
  },
  payment: {
    amount: (operationId?: string) =>
      ["payment", "amount", operationId] as const,
  },
} as const;
