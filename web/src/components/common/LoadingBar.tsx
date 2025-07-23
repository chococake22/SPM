"use client"

export default function LoadingBar() {
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
      </div>
    </div>
  );
}