"use client";

import React, { useState, useTransition } from "react";
import { Mail, Lock, User, ArrowRight, EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { validateSignupInput } from "@/lib/validation-schema";
import { createValidator, fieldValidators } from "@/lib/helper/helper";
import { register_user } from "@/actions/auth/register";

import { LoadingSpinner } from "../loader";

const RegisterPage = () => {
  const [formData, setFormData] = useState<SignupInput>({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [validationResult, setValidationResult] =
    useState<ValidationResult<SignupInput> | null>(null);

  const [isFormvalid, setIsFormValid] = useState(false);
  const validateField = createValidator(fieldValidators);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // Toggle confirm password visibility
  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible((prev) => !prev);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle authentication logic here

    startTransition(() => {
      register_user(formData).then((data) => {
        if (data.success) {
          toast.success(data.success);
          router.replace("/auth/login");
        } else {
          toast.error(data.error);
        }
      });
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // setFormData({ ...formData, [e.target.name]: e.target.value });

    setFormData((prev) => {
      const newFormData = { ...prev, [name]: value };
      const result = validateField(name, value, newFormData);
      const validateSignUp = validateSignupInput(newFormData);

      setIsFormValid(validateSignUp.isValid);
      setValidationResult(result);
      return newFormData;
    });
  };

  if (isPending) {
    return <LoadingSpinner text="Verifying your email..." />;
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Orama Board
        </h1>
        <p className="font-thin text-sm  italic text-center text-gray-900 mb-2">
          (Visualize Your Future, Achieve Your Dreams.)
        </p>

        <h2 className="mt-6 text-center text-2xl font-semibold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <>
              <div>
                <label
                  htmlFor="first_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="John"
                  />
                  {validationResult?.errors.first_name && (
                    <p className="text-red-500 text-xs">
                      {validationResult.errors.first_name}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="last_name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Doe"
                  />
                  {validationResult?.errors.last_name && (
                    <p className="text-red-500 text-xs">
                      {validationResult.errors.last_name}
                    </p>
                  )}
                </div>
              </div>
              {/* <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-700"
                  >
                    UserName
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div> */}
            </>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
                {validationResult?.errors.email && (
                  <p className="text-red-500 text-xs">
                    {validationResult.errors.email}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  id="password"
                  value={formData.password}
                  placeholder="xxxxxxxx"
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-3 "
                >
                  {isPasswordVisible ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {validationResult?.errors.password && (
                  <p className="text-red-500 text-xs">
                    {validationResult.errors.password}
                  </p>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={isConfirmPasswordVisible ? "text" : "password"}
                  name="confirmPassword"
                  id="confirmPassword"
                  placeholder="xxxxxxxx"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-3"
                >
                  {isConfirmPasswordVisible ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                {validationResult?.errors.confirmPassword && (
                  <p className="text-red-500 text-xs">
                    {validationResult.errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!isFormvalid}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                <span className="absolute left-0 top-2.5 flex items-center pl-3">
                  <ArrowRight
                    className={`h-5 w-5  g ${
                      !validationResult?.isValid || !isFormvalid
                        ? "text-gray-200"
                        : "text-blue-400 roup-hover:text-blue-300"
                    }`}
                  />
                </span>
                Sign up
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/auth/login"
                className="text-blue-500 hover:text-blue-600"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
