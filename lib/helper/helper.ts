import { Category } from "@prisma/client";
import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const verifyPassword = async (
  password: string,
  hashedPassword: string
) => {
  return bcrypt.compare(password, hashedPassword);
};

export function UUIDv4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const randomHex = (Math.random() * 16) | 0;
    const value = c === "x" ? randomHex : (randomHex & 0x3) | 0x8; // Ensure y is one of 8, 9, a, or b
    return value.toString(16);
  });
}

const validatePasswordStrength = (password: string): string | null => {
  // Minimum length 8 characters, 1 uppercase, 1 lowercase, 1 number, and 1 special character
  const minLength = 8;
  const uppercase = /[A-Z]/;
  const lowercase = /[a-z]/;
  const number = /[0-9]/;
  const specialChar = /[!@#$%^&*(),.?":{}|<>]/;

  if (password.length < minLength) {
    return `Password must be at least ${minLength} characters.`;
  }
  if (!uppercase.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  // if (!lowercase.test(password)) {
  //   return "Password must contain at least one lowercase letter.";
  // }
  // if (!number.test(password)) {
  //   return "Password must contain at least one number.";
  // }
  // if (!specialChar.test(password)) {
  //   return "Password must contain at least one special character.";
  // }
  return null;
};

export const createValidator = (
  validators: Record<string, FieldValidation>
) => {
  return (
    fieldName: string,
    value: string,
    formData: Record<string, string>
  ): ValidationResult<any> => {
    const errors: Record<string, string | null> = {};
    const validInputs: Record<string, string> = {};

    // Get the validator for the specific field
    const validator = validators[fieldName];

    if (validator) {
      const error = validator.validate(value, formData);
      if (error) {
        errors[fieldName] = error;
      } else {
        validInputs[fieldName] = value;
      }
    }

    const isValid = Object.values(errors).every((error) => error === null);

    return { isValid, errors, validInputs };
  };
};

export const fieldValidators = {
  email: {
    validate: (value: string) => {
      if (!value.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
        return "Email is not valid.";
      return null;
    },
    errorMessage: "Email is required.",
  },
  password: {
    validate: (value: string) => {
      if (!value.trim()) return "Password is required.";
      // if (value.length < 6) return "Password must be at least 6 characters.";
      const strengthError = validatePasswordStrength(value);
      if (strengthError) return strengthError;
      return null;
    },
    errorMessage: "Password is required.",
  },
  confirmPassword: {
    validate: (value: string, formData: Record<string, string>) => {
      if (!value) return "Confirm Password is required.";
      if (value !== formData.password) return "Passwords do not match.";
      return null;
    },
    errorMessage: "Confirm Password is required.",
  },
  name: {
    validate: (value: string) => {
      if (value.length < 3) return "Name must be at least 3 characters.";
      return null;
    },
    errorMessage: "Name is required.",
  },
  first_name: {
    validate: (value: string) => {
      if (value.length < 3) return "Name must be at least 3 characters.";
      return null;
    },
    errorMessage: "Name is required.",
  },
  last_name: {
    validate: (value: string) => {
      if (value.length < 3) return "Name must be at least 3 characters.";
      return null;
    },
    errorMessage: "Name is required.",
  },
};

export const CategoryDisplay: Record<Category, string> = {
  [Category.CAREER]: "Career",
  FINANCE: "Finance",
  HEALTH: "Health",
  RELATIONSHIPS: "Relationship",
  PERSONAL_GROWTH: "Personal Growth",
  OTHER: "Other",
};

export function makeSlug(name: string) {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading and trailing whitespace
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-alphanumeric characters with a hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}

export function calculateTimeline(date: any) {
  const givenDate = new Date(date); // Convert input to a Date object

  if (isNaN(givenDate.getTime())) {
    return "Invalid date"; // Handle invalid dates
  }

  const now = new Date();
  const diffInMs = now.getTime() - givenDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);

  if (diffInSeconds < 1) return "1 second ago";
  if (diffInSeconds < 60)
    return `${diffInSeconds} second${diffInSeconds !== 1 ? "s" : ""} ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? "s" : ""} ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours !== 1 ? "s" : ""} ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays !== 1 ? "s" : ""} ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4)
    return `${diffInWeeks} week${diffInWeeks !== 1 ? "s" : ""} ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12)
    return `${diffInMonths} month${diffInMonths !== 1 ? "s" : ""} ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears !== 1 ? "s" : ""} ago`;
}

export function calculateProgress(date: any, timeline: any) {
  const now = new Date();
  const startDate = new Date(date);

  if (isNaN(startDate.getTime())) {
    throw new Error("Invalid start date");
  }

  const timelineParts = timeline.match(/(\d+)\s*(days|weeks|months|years)/i);

  if (!timelineParts) {
    throw new Error("Invalid timeline format");
  }

  const [_, amount, unit] = timelineParts;
  const totalTimelineMs = convertToMilliseconds(Number(amount), unit);
  const elapsedMs = now.getTime() - startDate.getTime();

  const progress = Math.min(
    Math.max((elapsedMs / totalTimelineMs) * 100, 0),
    100
  ); // Clamp between 0 and 100
  return Math.round(progress); // Return progress as a whole number
}

function convertToMilliseconds(amount: any, unit: any) {
  const msPerDay = 24 * 60 * 60 * 1000;

  switch (unit.toLowerCase()) {
    case "days":
      return amount * msPerDay;
    case "weeks":
      return amount * 7 * msPerDay;
    case "months":
      return amount * 30 * msPerDay; // Approximation
    case "years":
      return amount * 365 * msPerDay; // Approximation
    default:
      throw new Error(`Unknown time unit: ${unit}`);
  }
}


export function getTopRecentItems(dataArray: any, dateKey: any) {
  return dataArray
    .sort(
      (a: any, b: any) =>
        new Date(b[dateKey] as string).getTime() -
        new Date(a[dateKey] as string).getTime()
    )
    .slice(0, 3);
}

type DiffResult = {
  missingKeys: { [objectIndex: number]: string[] };
  extraKeys: { [objectIndex: number]: string[] };
  commonKeys: string[];
};

function compareObjectKeys(...objects: Record<string, any>[]): DiffResult {
  if (objects.length < 2) {
    throw new Error("At least two objects are required for comparison");
  }

  // Get all unique keys from all objects
  const allKeys = new Set<string>();
  objects.forEach((obj) => {
    Object.keys(obj).forEach((key) => allKeys.add(key));
  });

  const result: DiffResult = {
    missingKeys: {},
    extraKeys: {},
    commonKeys: [],
  };

  // Find keys present in all objects (common keys)
  result.commonKeys = Array.from(allKeys).filter((key) =>
    objects.every((obj) => key in obj)
  );

  // For each object, find missing and extra keys
  objects.forEach((obj, index) => {
    const objKeys = new Set(Object.keys(obj));

    // Find missing keys (present in some other object but not in this one)
    result.missingKeys[index] = Array.from(allKeys).filter(
      (key) => !objKeys.has(key)
    );

    // Find extra keys (present in this object but not in all others)
    result.extraKeys[index] = Array.from(objKeys).filter((key) =>
      objects.some(
        (otherObj, otherIndex) => index !== otherIndex && !(key in otherObj)
      )
    );
  });

  return result;
}
