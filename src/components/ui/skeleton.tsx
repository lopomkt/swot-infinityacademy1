
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useReducedMotion } from '@/hooks/use-reduced-motion'

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
      initial={prefersReducedMotion ? {} : { opacity: 0.5 }}
      animate={prefersReducedMotion ? {} : { opacity: 1 }}
      transition={{ 
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse"
      }}
    />
  )
}

export { Skeleton }
