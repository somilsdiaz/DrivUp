import type React from "react"
import Skeleton from "./CardNewsSkeleton"

const ModernSkeletonLoader: React.FC = () => {
    return (

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Image placeholder */}
            <Skeleton className="h-48 w-full" />

            <div className="p-5 space-y-3">
                {/* Title */}
                <Skeleton className="h-6 w-3/4" />

                {/* Description */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />

                {/* Tags */}
                <div className="flex space-x-2 pt-2">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-14 rounded-full" />
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center space-x-2">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-md" />
                </div>
            </div>
        </div>
    )
}

export default ModernSkeletonLoader

