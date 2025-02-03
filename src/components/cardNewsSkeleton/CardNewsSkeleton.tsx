import type React from "react"

interface SkeletonProps {
    className?: string
}

const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
    return (
        <div
            className={`
        bg-gray-200 
        relative 
        overflow-hidden 
        before:absolute 
        before:inset-0 
        before:-translate-x-full 
        before:animate-[shimmer_1.5s_infinite] 
        before:bg-gradient-to-r 
        before:from-transparent 
        before:via-white/10 
        before:to-transparent 
        ${className}
      `}
        />
    )
}

export default Skeleton

