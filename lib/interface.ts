interface UserData {
  id: string;
  email: string;
  password: string;
}

interface SignupInput {
  username?: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirmPassword: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface ValidationResult<T> {
  isValid: boolean;
  errors: Record<keyof T, string | null>;
  validInputs: Partial<T>;
}

interface FieldValidation {
  // validate: (value: string) => string | null;
  validate: (value: string, formData: Record<string, string>) => string | null;
  errorMessage: string;
}

