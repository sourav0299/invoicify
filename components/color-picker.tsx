"use client"

interface ColorPickerProps {
  colors: string[]
  selectedColor: string
  onChange: (color: string) => void
}

export default function ColorPicker({ colors, selectedColor, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((color, index) => (
        <div
          key={index}
          className={`w-10 h-10 rounded-full cursor-pointer ${selectedColor === color ? "ring-2 ring-offset-2 ring-blue-500" : ""}`}
          style={{ background: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  )
}

