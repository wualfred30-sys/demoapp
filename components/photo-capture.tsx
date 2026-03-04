"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, RefreshCw, Check } from "lucide-react"

interface PhotoCaptureProps {
    onPhotoCaptured: (base64Data: string) => void
    /** Called whenever the component starts or stops the camera stream.
     *  Parent can store this callback in a ref and invoke it to force-stop
     *  the camera before navigating away from the step. */
    onCameraStop?: (stopFn: (() => void) | null) => void
    disabled?: boolean
}

export function PhotoCapture({ onPhotoCaptured, onCameraStop, disabled }: PhotoCaptureProps) {
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [capturedImage, setCapturedImage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [facingMode, setFacingMode] = useState<"user" | "environment">("user")
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    // Keep a ref so the cleanup effect always sees the latest stream
    const streamRef = useRef<MediaStream | null>(null)

    // ─── Camera stream management ──────────────────────────────────────────────

    const stopCamera = useCallback(() => {
        const activeStream = streamRef.current
        if (activeStream) {
            activeStream.getTracks().forEach((track) => track.stop())
            streamRef.current = null
            setStream(null)
        }
    }, [])

    // Comment 3 fix: always stop all active tracks when the component unmounts
    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach((track) => track.stop())
        }
    }, [])

    // Keep stream ref in sync so cleanup effect always has the latest stream
    useEffect(() => {
        streamRef.current = stream
    }, [stream])

    // Expose stopCamera to the parent (for back/skip/continue navigation)
    useEffect(() => {
        onCameraStop?.(stopCamera)
        return () => onCameraStop?.(null)
    }, [onCameraStop, stopCamera])

    const startCamera = useCallback(async () => {
        setError(null)
        setCapturedImage(null)
        // Notify parent that photo is cleared
        onPhotoCaptured("")
        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode, aspectRatio: 1 },
            })
            if (videoRef.current) {
                videoRef.current.srcObject = newStream
            }
            streamRef.current = newStream
            setStream(newStream)
        } catch (err) {
            setError("Could not access camera. Please ensure permissions are granted.")
            console.error("Camera error:", err)
        }
    }, [facingMode, onPhotoCaptured])

    const flipCamera = () => {
        stopCamera()
        setFacingMode((prev) => (prev === "user" ? "environment" : "user"))
        setTimeout(startCamera, 100)
    }

    // ─── Photo capture ─────────────────────────────────────────────────────────

    const capturePhoto = () => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext("2d")

        if (!ctx) return

        // Create a 1:1 aspect ratio square for the ID profile photo
        const size = Math.min(video.videoWidth, video.videoHeight)
        canvas.width = size
        canvas.height = size

        // Calculate crop to center the image
        const startX = (video.videoWidth - size) / 2
        const startY = (video.videoHeight - size) / 2

        // Apply mirroring if it's the front camera
        if (facingMode === "user") {
            ctx.translate(size, 0)
            ctx.scale(-1, 1)
        }

        ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size)

        const base64Data = canvas.toDataURL("image/jpeg", 0.9)
        setCapturedImage(base64Data)
        stopCamera()

        // Comment 2 fix: commit to parent immediately on capture so the photo
        // is never "orphaned" even if the user skips the explicit confirmation step.
        onPhotoCaptured(base64Data)
    }

    // ─── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="flex flex-col gap-4">
            {/* Hidden canvas for processing */}
            <canvas ref={canvasRef} className="hidden" />

            {!stream && !capturedImage ? (
                <div className="flex aspect-square w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/30 p-6 text-center">
                    <div className="mb-4 rounded-full bg-[#00FFCC]/10 p-4">
                        <Camera className="h-8 w-8 text-[#00CCAA]" />
                    </div>
                    <h3 className="mb-2 font-semibold">Take Profile Photo</h3>
                    <p className="mb-6 text-sm text-muted-foreground">This will be the official portrait on your Digital ID.</p>
                    <Button onClick={startCamera} disabled={disabled} className="rounded-xl bg-[#00FFCC] font-bold text-black hover:bg-[#00DDAA]">
                        Open Camera
                    </Button>
                    {error && <p className="mt-4 text-sm font-medium text-destructive">{error}</p>}
                </div>
            ) : capturedImage ? (
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={capturedImage || "/placeholder.svg"} alt="Captured portrait" className="h-full w-full object-cover" />
                        {/* Confirmation badge — visible proof that the photo is committed */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-[#00FFCC] px-3 py-1.5 shadow-lg">
                            <Check className="h-3.5 w-3.5 text-black" strokeWidth={3} />
                            <span className="text-xs font-bold text-black">Photo attached</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Button variant="outline" onClick={startCamera} className="flex-1 rounded-xl h-12 border-border">
                            Retake
                        </Button>
                        <Button disabled className="flex-1 rounded-xl h-12 bg-[#00FFCC]/40 font-bold text-black cursor-default">
                            Confirmed <Check className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-black">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className={`h-full w-full object-cover ${facingMode === "user" ? "scale-x-[-1]" : ""}`}
                        />
                        {/* Overlay guidelines for face centering */}
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-2/3 h-2/3 border-2 border-white/50 rounded-full border-dashed" />
                        </div>

                        <button
                            onClick={flipCamera}
                            className="absolute right-4 top-4 rounded-full bg-black/50 p-3 text-white backdrop-blur-md"
                        >
                            <RefreshCw className="h-5 w-5" />
                        </button>
                        <div className="absolute bottom-6 left-0 right-0 flex justify-center">
                            <button
                                onClick={capturePhoto}
                                className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/50 bg-white"
                            >
                                <div className="h-12 w-12 rounded-full bg-black" />
                            </button>
                        </div>
                    </div>
                    <Button variant="outline" onClick={stopCamera} className="w-full rounded-xl border-border h-12">
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    )
}
