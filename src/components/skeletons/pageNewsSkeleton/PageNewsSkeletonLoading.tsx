import type React from "react"
import PageNewsSkeleton from "./PageNewsSkeleton"

const PageNewsSkeletonLoading: React.FC = () => {
    return (
        <div className="max-w-2xl mx-auto p-4 space-y-4 bg-white rounded-lg shadow-md">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <PageNewsSkeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-2 flex-1">
                    <PageNewsSkeleton className="h-4 w-1/4" />
                    <PageNewsSkeleton className="h-3 w-1/3" />
                </div>
            </div>
            
            {/* Image placeholder */}
            <PageNewsSkeleton className="h-72 w-full rounded-md" />

            {/* Content */}
            <div className="space-y-2">
                <PageNewsSkeleton className="h-4 w-full" />
                <PageNewsSkeleton className="h-4 w-5/6" />
                <PageNewsSkeleton className="h-4 w-4/6" />
            </div>
            <div className="space-y-2">
                <PageNewsSkeleton className="h-4 w-full" />
                <PageNewsSkeleton className="h-4 w-5/6" />
                <PageNewsSkeleton className="h-4 w-4/6" />
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                    <PageNewsSkeleton className="w-8 h-8 rounded-full" />
                    <PageNewsSkeleton className="w-8 h-8 rounded-full" />
                    <PageNewsSkeleton className="w-8 h-8 rounded-full" />
                </div>
                <PageNewsSkeleton className="w-20 h-8 rounded-md" />
            </div>
        </div>
    )
}

export default PageNewsSkeletonLoading

