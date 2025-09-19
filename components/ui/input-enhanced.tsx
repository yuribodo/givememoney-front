import * as React from "react"
import { motion } from "motion/react"
import { Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import { Label } from "./label"

export interface InputEnhancedProps
  extends React.ComponentProps<typeof Input> {
  error?: string
  label?: string
  showPasswordToggle?: boolean
}

const InputEnhanced = React.forwardRef<HTMLInputElement, InputEnhancedProps>(
  ({ className, type, error, label, showPasswordToggle = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const inputType = showPasswordToggle && type === "password"
      ? (showPassword ? "text" : "password")
      : type

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
        <div className="relative">
          <Input
            type={inputType}
            className={cn(
              // Override shadcn/ui default styles with our brand styling
              "h-auto rounded-xl border bg-white/70 backdrop-blur-sm px-4 py-3 text-base font-body transition-all duration-300",
              "placeholder:text-electric-slate-400 hover:bg-white/80 focus:bg-white/90",
              "file:border-0 file:bg-transparent file:text-sm file:font-medium",
              // Focus and error states - only show during focus, not persistent
              "focus-visible:border-cyber-mint-500 focus-visible:ring-2 focus-visible:ring-cyber-mint-500/20 focus-visible:shadow-lg focus-visible:shadow-cyber-mint-500/10",
              error
                ? "border-error-rose"
                : "border-electric-slate-200 hover:border-electric-slate-300",
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
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </motion.button>
          )}
        </div>

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
)
InputEnhanced.displayName = "InputEnhanced"

export { InputEnhanced }