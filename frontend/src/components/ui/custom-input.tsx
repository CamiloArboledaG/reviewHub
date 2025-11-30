import * as React from "react";
import { cn } from "@/lib/utils";

export interface CustomInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> {
  /** Tamaño del input */
  variant?: 'sm' | 'md' | 'lg';
  /** Tipo de campo */
  asTextarea?: boolean;
  /** Número de filas para textarea */
  rows?: number;
  /** Icono a la izquierda */
  leftIcon?: React.ReactNode;
  /** Icono a la derecha */
  rightIcon?: React.ReactNode;
  /** Clases personalizadas para el focus ring */
  focusRing?: string;
  /** Clases personalizadas para el border en focus */
  focusBorder?: string;
  /** Permite redimensionar el textarea */
  resize?: boolean;
}

const CustomInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, CustomInputProps>(
  ({
    className,
    variant = 'md',
    asTextarea = false,
    rows = 4,
    leftIcon,
    rightIcon,
    focusRing = 'focus:ring-2 focus:ring-purple-500',
    focusBorder = 'focus:border-transparent',
    resize = false,
    type,
    ...props
  }, ref) => {
    // Estilos base
    const baseStyles = "w-full border-2 border-gray-300 rounded-lg focus:outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400";

    // Variantes de tamaño
    const sizeVariants = {
      sm: "px-3 py-2 text-sm",
      md: "px-4 py-2.5 text-base",
      lg: "px-4 py-3 text-base",
    };

    // Ajuste de padding si hay iconos
    const paddingWithIcons = cn(
      sizeVariants[variant],
      leftIcon && "pl-10",
      rightIcon && "pr-10"
    );

    // Estilos para textarea
    const textareaStyles = cn(
      !resize && "resize-none"
    );

    // Clases finales
    const inputClasses = cn(
      baseStyles,
      paddingWithIcons,
      focusRing,
      focusBorder,
      asTextarea && textareaStyles,
      "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50",
      className
    );

    // Renderizar con wrapper si hay iconos
    if (leftIcon || rightIcon) {
      return (
        <div className="relative w-full">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}
          {asTextarea ? (
            <textarea
              className={inputClasses}
              rows={rows}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
          ) : (
            <input
              type={type}
              className={inputClasses}
              ref={ref as React.Ref<HTMLInputElement>}
              {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
            />
          )}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
      );
    }

    // Renderizar sin wrapper si no hay iconos
    if (asTextarea) {
      return (
        <textarea
          className={inputClasses}
          rows={rows}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      );
    }

    return (
      <input
        type={type}
        className={inputClasses}
        ref={ref as React.Ref<HTMLInputElement>}
        {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
      />
    );
  }
);

CustomInput.displayName = "CustomInput";

export { CustomInput };
