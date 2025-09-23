import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type InputFieldProps<T> = {
  label: string;
  id: keyof T;
  type: string;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  required?: boolean;
  message?: string;
  placeholder?: string;
  className?: string;
  min?: number;
  value?: string | number;
  autoFocus?: boolean;
  readOnly?: boolean;
  pattern?: RegExp;
};

function InputField<T>({
  label,
  id,
  type,
  register,
  errors,
  required,
  message,
  placeholder,
  className,
  min,
  value,
  autoFocus,
  readOnly,
  pattern,
}: InputFieldProps<T>) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={String(id)} className="text-slate-700 font-semibold">
        {label}
      </label>
      <input
        id={String(id)}
        type={type}
        placeholder={placeholder}
        className={`border p-2 rounded ${className || ""}`}
        min={min}
        value={value}
        autoFocus={autoFocus}
        readOnly={readOnly}
        {...register(id, {
          required: required ? message : false,
          pattern: pattern ? { value: pattern, message } : undefined,
          min: min !== undefined ? { value: min, message } : undefined,
        })}
      />
      {errors[id] && (
        <p className="text-red-500 text-sm">
          {(errors[id]?.message as string) || message}
        </p>
      )}
    </div>
  );
}

export default InputField;
