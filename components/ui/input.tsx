import * as React from "react"
import { motion } from "motion/react"
import { Eye, EyeSlash } from "@phosphor-icons/react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Label } from "./label"

const inputVariants = cva(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 w-full min-w-0 border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  {
    variants: {
      variant: {
        default: "border-input h-9 rounded-md focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        auth: "h-auto rounded-xl border bg-white px-4 py-3 text-base font-body transition-all duration-300 placeholder:text-electric-slate-400 hover:bg-gray-50 focus-visible:border-cyber-mint-500 focus-visible:ring-2 focus-visible:ring-cyber-mint-500/20 border-gray-200 hover:border-gray-300",
      },
      hasError: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        variant: "auth",
        hasError: true,
        class: "border-error-rose",
      },
    ],
    defaultVariants: {
      variant: "default",
      hasError: false,
    },
  }
)

export interface InputProps
  extends Omit<React.ComponentProps<"input">, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string
  label?: string
  showPasswordToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, error, label, showPasswordToggle = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)
    const hasError = Boolean(error)

    const inputType = showPasswordToggle && type === "password"
      ? (showPassword ? "text" : "password")
      : type

    const InputComponent = (
      <div className="relative">
        <input
          type={inputType}
          data-slot="input"
          className={cn(
            inputVariants({ variant, hasError }),
            showPasswordToggle && "pr-12",
            className
          )}
          ref={ref}
          {...props}
        />

        {showPasswordToggle && type === "password" && (
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-electric-slate-400 hover:text-electric-slate-600 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {showPassword ? (
              <EyeSlash size={20} weight="duotone" />
            ) : (
              <Eye size={20} weight="duotone" />
            )}
          </motion.button>
        )}
      </div>
    )

    // If variant is auth, wrap with motion and include label/error
    if (variant === "auth") {
      return (
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {label && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Label
                htmlFor={props.id}
                className="text-sm font-medium text-electric-slate-700 font-body"
              >
                {label}
              </Label>
            </motion.div>
          )}
          {InputComponent}
          {error && (
            <motion.p
              className="text-sm text-error-rose font-body"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              {error}
            </motion.p>
          )}
        </motion.div>
      )
    }

    // For default variant, return just the input
    return InputComponent
  }
)
Input.displayName = "Input"

export { Input, inputVariants }