import type React from "react"

interface SkeletonProps {
    className?: string
}

const PageNewsSkeleton: React.FC<SkeletonProps> = ({ className }) => {
    return <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 ${className}`} />
}


export default PageNewsSkeleton

