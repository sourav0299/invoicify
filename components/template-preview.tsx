"use client"

interface TemplatePreviewProps {
  id: number
  isSelected: boolean
  onClick: () => void
}

export default function TemplatePreview({ id, isSelected, onClick }: TemplatePreviewProps) {
  // Get template-specific preview styles
  const getPreviewStyles = () => {
    switch (id) {
      case 1: // Modern Dark
        return {
          container: "bg-white rounded-md border border-gray-200",
          header: "h-6 bg-[#262930] w-full mb-1",
          content: "px-2 py-1",
          line1: "h-1 bg-gray-300 w-full mb-1 rounded-sm",
          line2: "h-1 bg-gray-300 w-3/4 mb-1 rounded-sm",
          line3: "h-1 bg-gray-300 w-1/2 mb-1 rounded-sm",
          footer: "h-2 bg-[#262930] w-full mb-1 mt-1",
          name: "Modern Dark",
        }
      case 2: // Clean Minimalist
        return {
          container: "bg-white rounded-md border border-gray-200",
          header: "h-4 bg-white w-full mb-1 border-b border-gray-200",
          content: "px-2 py-1 flex",
          line1: "h-12 bg-gray-100 w-1/4 mr-2 rounded-sm",
          line2: "h-12 bg-white w-3/4 border border-gray-200 rounded-sm",
          line3: "h-1 bg-gray-300 w-1/2 mb-1 rounded-sm",
          footer: "h-2 bg-white w-full border-t border-gray-200 mt-1",
          name: "Clean",
        }
      case 3: // Diagonal Split
        return {
          container: "bg-white rounded-md border border-gray-200 overflow-hidden",
          header: "h-6 w-full mb-1 relative",
          headerContent: "absolute top-0 left-0 w-full h-full bg-[#e6f7f2]",
          headerOverlay: "absolute top-0 right-0 w-1/2 h-full bg-[#0a5c4a]",
          content: "px-2 py-1",
          line1: "h-1 bg-gray-300 w-full mb-1 rounded-sm",
          line2: "h-1 bg-gray-300 w-3/4 mb-1 rounded-sm",
          line3: "h-1 bg-gray-300 w-1/2 mb-1 rounded-sm",
          footer: "h-2 bg-[#0a5c4a] w-full mb-1 mt-1",
          name: "Diagonal",
        }
      case 4: // Curved Design
        return {
          container: "bg-white rounded-md border border-gray-200 overflow-hidden",
          header: "h-6 bg-[#3b4a8f] w-full mb-1 rounded-b-full",
          content: "px-2 py-1",
          line1: "h-1 bg-[#e9ecf6] w-full mb-1 rounded-sm",
          line2: "h-1 bg-[#e9ecf6] w-3/4 mb-1 rounded-sm",
          line3: "h-1 bg-[#e9ecf6] w-1/2 mb-1 rounded-sm",
          footer: "h-2 bg-[#3b4a8f] w-full mb-1 mt-1 rounded-t-full",
          name: "Curved",
        }
      case 5: // Customizable
        return {
          container: "bg-white rounded-md border border-gray-200",
          header: "h-6 bg-[#4F46E5] w-full mb-1",
          content: "px-2 py-1",
          line1: "h-1 bg-gray-300 w-full mb-1 rounded-sm",
          line2: "h-1 bg-gray-300 w-3/4 mb-1 rounded-sm",
          line3: "h-1 bg-gray-300 w-1/2 mb-1 rounded-sm",
          footer: "h-2 bg-[#4F46E5] w-full mb-1 mt-1",
          name: "Custom",
        }
      default:
        return {
          container: "bg-gray-100 rounded-sm",
          header: "h-2 bg-gray-300 w-full mb-1 rounded-sm",
          content: "px-2 py-1",
          line1: "h-1 bg-gray-300 w-full mb-1 rounded-sm",
          line2: "h-1 bg-gray-300 w-3/4 mb-1 rounded-sm",
          line3: "h-1 bg-gray-300 w-1/2 mb-1 rounded-sm",
          footer: "h-2 bg-gray-300 w-1/4 mb-1 rounded-sm mt-1",
          name: "Template",
        }
    }
  }

  const styles = getPreviewStyles()

  return (
    <div
      className={`cursor-pointer rounded-md ${isSelected ? "border-2 border-teal-500" : "border border-gray-200"}`}
      onClick={onClick}
    >
      <div className="p-1">
        <div className={`aspect-video ${styles.container} flex items-center justify-center overflow-hidden`}>
          <div className="w-full">
            {id === 3 ? (
              <div className={styles.header}>
                <div className={styles.headerContent}></div>
                <div
                  className={styles.headerOverlay}
                  style={{
                    clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                  }}
                ></div>
              </div>
            ) : (
              <div className={styles.header}></div>
            )}
            <div className={styles.content}>
              <div className={styles.line1}></div>
              <div className={styles.line2}></div>
              <div className={styles.line3}></div>
              <div className="h-3"></div>
              <div className={styles.footer}></div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs mt-1">{styles.name}</p>
      </div>
    </div>
  )
}

