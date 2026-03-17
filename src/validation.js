import { z } from "zod";

// ─────────────────────────────────────────────────────────────
//  ZOD SCHEMAS — zero-trust input validation
//  All user-entered text is validated here before any processing.
// ─────────────────────────────────────────────────────────────

/** Quick Generate: the free-text idea field */
export const quickIdeaSchema = z
  .string()
  .min(3, "Please describe your task (at least 3 characters)")
  .max(2000, "Task description must be under 2000 characters")
  .transform((s) => s.trim());

/** Builder: a single framework field value */
const fieldValueSchema = z
  .string()
  .max(1000, "Field value must be under 1000 characters")
  .transform((s) => s.trim());

/** Builder: exclusion / "do not" text */
export const exclusionSchema = z
  .string()
  .max(500, "Exclusion text must be under 500 characters")
  .transform((s) => s.trim());

/** Builder: extra instructions text */
export const extraSchema = z
  .string()
  .max(500, "Extra instructions must be under 500 characters")
  .transform((s) => s.trim());

/** Builder: quality checklist items (array of up to 5 strings) */
export const checklistSchema = z
  .array(z.string().max(200).transform((s) => s.trim()))
  .max(5);

/**
 * Validate a map of framework field key→value pairs.
 * @param {Record<string, string>} fields
 * @returns {{ result: Record<string, string>, errors: Record<string, string>, ok: boolean }}
 */
export function validateFrameworkFields(fields) {
  const result = {};
  const errors = {};

  for (const [key, val] of Object.entries(fields)) {
    const parsed = fieldValueSchema.safeParse(val ?? "");
    if (parsed.success) {
      result[key] = parsed.data;
    } else {
      errors[key] = parsed.error.issues[0]?.message ?? "Invalid value";
    }
  }

  return { result, errors, ok: Object.keys(errors).length === 0 };
}
