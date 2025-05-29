import React from 'react'
import { useContext } from 'react';
import { LoadingContext } from './Context';

const Loading = () => {
  const { loading } = useContext(LoadingContext);
  if (!loading) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block">
          {/* Circular spinner */}
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-white font-medium">Loading...</p>
      </div>
    </div>
  )
}

export default Loading