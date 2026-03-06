"use client"

import { ChangeEvent, useId, useRef } from "react"

interface PhotoInputProps {
  value: string
  onChange: (value: string) => void
}

export function PhotoInput({ value, onChange }: PhotoInputProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="photo-input">
      <div className="photo-input__preview">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Resident portrait preview" className="photo-input__image" />
        ) : (
          <div className="photo-input__placeholder">
            <span className="photo-input__placeholder-icon">◎</span>
            <h3>Capture resident photo</h3>
            <p>On mobile this opens the camera. On desktop it lets you choose an image.</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept="image/*"
        capture="user"
        className="sr-only"
        onChange={handleFileChange}
      />

      <div className="photo-input__actions">
        <button type="button" className="button button--primary" onClick={() => inputRef.current?.click()}>
          {value ? "Retake Photo" : "Take Photo"}
        </button>
        {value ? (
          <button type="button" className="button button--ghost" onClick={() => onChange("")}>Remove</button>
        ) : (
          <span className="photo-input__hint">Optional for the demo, but recommended for the ID preview.</span>
        )}
      </div>
    </div>
  )
}
