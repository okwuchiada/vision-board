import { z } from "zod";

export const validateSignupInput = (
  input: SignupInput
): ValidationResult<SignupInput> => {
  const errors: Record<keyof SignupInput, string | null> = {
    username: null,
    email: null,
    first_name: null,
    last_name: null,
    password: null,
    confirmPassword: null,
  };

  const validInputs: Partial<SignupInput> = {};

  // Validate username
  //   if (!input.username.trim()) {
  //     errors.username = "Username is required.";
  //   } else if (input.username.length < 3) {
  //     errors.username = "Username must be at least 3 characters.";
  //   } else {
  //     validInputs.username = input.username;
  //   }

  // Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(input.email)) {
    errors.email = "Email is not valid.";
  } else {
    validInputs.email = input.email;
  }

  //Validate Firtname

  if (!input.first_name.trim()) {
    errors.first_name = "First name is required.";
  } else if (input.first_name.length < 3) {
    errors.first_name = "First name must be at least 3 characters.";
  } else {
    validInputs.first_name = input.first_name;
  }

  //Validate Lastname
  if (!input.last_name.trim()) {
    errors.last_name = "Last name is required.";
  } else if (input.last_name.length < 3) {
    errors.last_name = "Last name must be at least 3 characters.";
  } else {
    validInputs.last_name = input.last_name;
  }

  // Validate password
  if (!input.password.trim()) {
    errors.password = "Password is required.";
  } else if (input.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  } else {
    validInputs.password = input.password;
  }

  // Validate confirm password
  if (input.confirmPassword !== input.password) {
    errors.confirmPassword = "Passwords do not match.";
  } else {
    validInputs.confirmPassword = input.confirmPassword;
  }

  // Check overall validity
  const isValid = Object.values(errors).every((error) => error === null);

  return { isValid, errors, validInputs };
};

export const validateLoginInput = (
  input: LoginInput
): ValidationResult<LoginInput> => {
  const errors: Record<keyof LoginInput, string | null> = {
    email: null,
    password: null,
  };

  const validInputs: Partial<LoginInput> = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!input.email.trim()) {
    errors.email = "Email is required.";
  } else if (!emailRegex.test(input.email)) {
    errors.email = "Email is not valid.";
  } else {
    validInputs.email = input.email;
  }

  // Validate password
  if (!input.password.trim()) {
    errors.password = "Password is required.";
  } else if (input.password.length < 6) {
    errors.password = "Password must be at least 6 characters.";
  } else {
    validInputs.password = input.password;
  }

  const isValid = Object.values(errors).every((error) => error === null);

  return { isValid, errors, validInputs };
};

export const BoardSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  timeline: z.string(),
  slug: z.string(),
});

export const GoalSchema = z.object({
  goal: z.string().min(1, "Goal is required"),
  category: z.enum([
    "CAREER",
    "FINANCE",
    "HEALTH",
    "RELATIONSHIPS",
    "PERSONAL_GROWTH",
    "OTHER",
  ]),
  color: z.string(),
  // timeline: z.string(),
});

export const BoardFetchOptionsSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'updatedAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().optional(),
  includeGoals: z.boolean().default(false)
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string()),
});