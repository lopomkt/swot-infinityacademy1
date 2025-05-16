
import { cn } from "@/lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"
import { useReducedMotion } from '@/hooks/use-reduced-motion'

interface SkeletonProps extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "transition"> {
  className?: string;
}

function Skeleton({
  className,
  ...props
}: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  const motionProps = prefersReducedMotion 
    ? {}
    : {
        initial: { opacity: 0.5 },
        animate: { opacity: 1 },
        transition: { 
          duration: 0.8,
          repeat: Infinity,
          repeatType: "reverse" as const
        }
      };

  return (
    <motion.div
      className={cn("rounded-md bg-muted", className)}
      {...motionProps}
      {...props}
    />
  )
}

export { Skeleton }
