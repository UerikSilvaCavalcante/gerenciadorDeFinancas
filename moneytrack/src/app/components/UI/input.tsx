import { forwardRef } from "react";
import { UseFormRegister } from "react-hook-form";
import { trasnferFilterForm } from "../../transfers/page";
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  width?: string;
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

export { Input, Checkbox, Select };
