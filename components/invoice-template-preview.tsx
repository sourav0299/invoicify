"use client"

interface TemplatePreviewProps {
  id: number
  isSelected: boolean
  onClick: () => void
}

export default function TemplatePreview({ id, isSelected, onClick }: TemplatePreviewProps) {
  return (
    <div
      className={`cursor-pointer rounded-md border ${isSelected ? "border-teal-500" : "border-gray-200"}`}
      onClick={onClick}
    >
      <div className="p-1">
        <div className="bg-gray-100 aspect-video rounded-sm flex items-center justify-center">
          {/* Template preview content - simplified version of the invoice */}
          <div className="w-full px-2">
            {/* Header line */}
            <div className="h-1 bg-gray-300 w-full mb-1 rounded-sm"></div>
            {/* Content lines */}
            <div className="h-1 bg-gray-300 w-3/4 mb-1 rounded-sm"></div>
            <div className="h-1 bg-gray-300 w-1/2 mb-1 rounded-sm"></div>
            {/* Space */}
            <div className="h-4"></div>
            {/* Footer line */}
            <div className="h-2 bg-gray-300 w-1/4 mb-1 rounded-sm"></div>
          </div>
        </div>
        <p className="text-center text-xs mt-1">Template {id}</p>
      </div>
    </div>
  )
}

