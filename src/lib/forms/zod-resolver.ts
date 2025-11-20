"use client";

import type { FieldError, FieldErrors, Resolver } from "react-hook-form";
import type { z } from "zod";

export function createZodResolver<TSchema extends z.ZodTypeAny>(
  schema: TSchema
): Resolver<z.infer<TSchema>> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return {
        values: result.data,
        errors: {},
      };
    }

    const fieldErrors = result.error.flatten().fieldErrors;
    const errors = Object.entries(fieldErrors).reduce(
      (acc, [key, messages]) => {
        if (messages && messages.length > 0) {
          const fieldError: FieldError = {
            type: "validation",
            message: messages[0] ?? "Champ invalide",
          };
          acc[key as keyof z.infer<TSchema>] = fieldError as FieldErrors<
            z.infer<TSchema>
          >[keyof z.infer<TSchema>];
        }
        return acc;
      },
      {} as FieldErrors<z.infer<TSchema>>
    );

    return {
      values: {} as z.infer<TSchema>,
      errors,
    };
  };
}
