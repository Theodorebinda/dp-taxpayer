// src/components/Input/PasswordInput.tsx
import { InputType } from "@/types/types";
import React, { useState, useMemo } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { CircleX, CheckCircle, ShieldCheck } from "lucide-react";

const PasswordInput: React.FC<InputType> = ({
  id,
  placeholder,
  value,
  setValue,
  isOptional,
  property,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const password = (value as string) || "";

  // Validation du mot de passe
  const passwordValidation = useMemo(
    () => ({
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }),
    [password]
  );

  // Calcul de la force du mot de passe
  const getPasswordStrength = () => {
    if (password.length === 0) return null;

    const criteriaCount =
      Object.values(passwordValidation).filter(Boolean).length;

    if (criteriaCount <= 2) {
      return { level: "Faible", color: "text-red-500" };
    } else if (criteriaCount <= 4) {
      return { level: "Moyen", color: "text-yellow-500" };
    } else {
      return { level: "Fort", color: "text-green-500" };
    }
  };

  const passwordStrength = getPasswordStrength();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: string = e.target.value;
    setValue?.(newValue);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <input
          className="w-full min-w-52 text-sm rounded border border-foreground invalid:border-red-500 bg-gray px-3 py-2 pr-10 font-light bg-background text-foreground focus:border-background focus-visible:outline-none"
          type={isPasswordVisible ? "text" : "password"}
          name={property}
          placeholder={placeholder}
          id={id}
          disabled={props.isReadOnly}
          value={password}
          onChange={handleChange}
          required={!isOptional}
        />
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          className="absolute inset-y-0 right-4 flex items-center text-sm text-primary focus:outline-none"
          aria-label={
            isPasswordVisible
              ? "Masquer le mot de passe"
              : "Afficher le mot de passe"
          }
        >
          {isPasswordVisible ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
        </button>
      </div>

      {/* Indicateur de sécurité du mot de passe */}
      {password.length > 0 && (
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-sm text-foreground">
              Sécurité du mot de passe
            </span>
            {passwordStrength && (
              <span
                className={`text-sm underline font-medium ${passwordStrength.color}`}
              >
                {passwordStrength.level}
              </span>
            )}
          </div>
          <ul className="list-item list-inside text-sm text-muted-foreground space-y-1">
            <li className="flex justify-start items-center gap-2">
              {passwordValidation.minLength ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <CircleX className="w-4 h-4 text-red-500" />
              )}
              <span>Contient au moins 8 caractères</span>
            </li>
            <li className="flex justify-start items-center gap-2">
              {passwordValidation.hasUpperCase ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <CircleX className="w-4 h-4 text-red-500" />
              )}
              <span>Contient au moins une lettre majuscule</span>
            </li>
            <li className="flex justify-start items-center gap-2">
              {passwordValidation.hasLowerCase ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <CircleX className="w-4 h-4 text-red-500" />
              )}
              <span>Contient au moins une lettre minuscule</span>
            </li>
            <li className="flex justify-start items-center gap-2">
              {passwordValidation.hasNumber ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <CircleX className="w-4 h-4 text-red-500" />
              )}
              <span>Contient au moins un chiffre</span>
            </li>
            <li className="flex justify-start items-center gap-2">
              {passwordValidation.hasSpecialChar ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <CircleX className="w-4 h-4 text-red-500" />
              )}
              <span>Contient au moins un caractère spécial</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default PasswordInput;
