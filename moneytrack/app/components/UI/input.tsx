import { forwardRef } from "react";
import { UseFormRegister } from "react-hook-form";
import { trasnferFilterForm } from "../../transfers/page";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string;
}

interface CurrencyInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  width?: string;
  children?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ width, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={`border border-green-950 rounded-sm p-1.5 text-sm ${width}`}
      />
    );
  }
);

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ width, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        {...props}
        className={`border border-green-950 rounded-sm p-1.5 text-sm ${width}`}
      >
        {children}
      </select>
    );
  }
);

const Checkbox = ({
  register,
  value,
  cl,
  id,
}: {
  register: UseFormRegister<trasnferFilterForm>;
  id: string;
  value: string;
  cl: "type";
}) => {
  return (
    <div>
      <input
        id={id}
        {...register(cl, { setValueAs: (v) => (v == false ? undefined : v) })}
        value={value}
        type="checkbox"
        className="peer hidden"
      />
      <label
        htmlFor={id}
        className="h-5 w-5 flex rounded-md border border-green-950 light:bg-[#e8e8e8] dark:bg-green-400 peer-checked:bg-green-950 cursor-pointer  transition"
      >
        <svg
          fill="none"
          viewBox="0 0 24 24"
          className="w-5 h-5 stroke-green-400 "
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 12.6111L8.92308 17.5L20 6.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </label>
    </div>
  );
};

const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  (
    { value = "0.00", onChange, placeholder = "R$ 0,00", className, ...props },
    ref
  ) => {
    // Converte string "1669.80" para centavos
    const stringToCents = (str: string): number => {
      const floatValue = parseFloat(str) || 0;
      return Math.round(floatValue * 100);
    };

    // Converte centavos para string "1669.80"
    const centsToString = (cents: number): string => {
      return (cents / 100).toFixed(2);
    };

    const formatCurrency = (cents: number): string => {
      const reais = cents / 100;
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(reais);
    };

    const currentCents = stringToCents(value);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const allowedKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "ArrowLeft",
        "ArrowRight",
      ];

      if (allowedKeys.includes(e.key)) {
        if (e.key === "Backspace") {
          e.preventDefault();
          const newCents = Math.floor(currentCents / 10);
          onChange?.(centsToString(newCents)); // Retorna "1669.80"
        }
        return;
      }

      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const digit = parseInt(e.key);
      const newCents = currentCents * 10 + digit;

      if (newCents <= 99999999) {
        onChange?.(centsToString(newCents)); // Retorna "1669.80"
      }
    };

    return (
      <input
        ref={ref}
        type="text"
        value={formatCurrency(currentCents)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`border border-green-950 rounded-sm p-1.5 text-sm  ${className}`}
        {...props}
        readOnly
      />
    );
  }
);
CurrencyInput.displayName = "CurrencyInput";

export { Input, Checkbox, Select , CurrencyInput};
