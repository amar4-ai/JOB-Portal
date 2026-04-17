import React from 'react'

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">

      {/* Spinner */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
      </div>

      {/* Text */}
      <p className="text-gray-500 text-sm animate-pulse">
        Loading...
      </p>

    </div>
  )
}

export default Loading