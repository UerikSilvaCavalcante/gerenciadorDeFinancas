import React, { forwardRef } from "react";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    width?: string;
    content?:string
}


const PrimaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ width,content, ...props }, ref) => {
        return (
            <button
                ref={ref}
                {...props}
                className={`bg-green-500  rounded-sm p-1.5 text-green-950 active:bg-green-600 transition-colors text-sm cursor-pointer ${width}`}
            >
                {content}
            </button>
        )
    }
)

const SecundaryButton = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ width,content, ...props }, ref) => {
        return (
            <button
                ref={ref}
                {...props}
                className={`bg-green-900 rounded-sm p-1.5 text-green-400 active:bg-green-950 transition-colors text-sm cursor-pointer ${width}`}
            >
                {content}
            </button>
        )
    }
)

export  {PrimaryButton, SecundaryButton}