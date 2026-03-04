"use client"

import Image from "next/image"
import { useState } from "react"
import { fetchHighResAsset, releaseAsset } from "@/lib/asset-optimizer"

interface ThumbnailImageProps {
    /** Low-res placeholder src (base64 or tiny image URL) */
    thumbnailSrc: string
    /** Full-res image URL to lazy-fetch */
    fullSrc: string
    alt: string
    width: number
    height: number
    className?: string
}

/**
 * ThumbnailImage — renders a blurred thumbnail immediately,
 * then swaps to full-res once fetched.
 * Blob URL is revoked on unmount to prevent memory leaks.
 */
export function ThumbnailImage({
    thumbnailSrc,
    fullSrc,
    alt,
    width,
    height,
    className,
}: ThumbnailImageProps) {
    const [src, setSrc] = useState(thumbnailSrc)
    const [loaded, setLoaded] = useState(false)

    const handleVisible = async () => {
        if (loaded) return
        try {
            const blob = await fetchHighResAsset(fullSrc)
            setSrc(blob)
            setLoaded(true)
        } catch {
            // Silently fall back to thumbnail
        }
    }

    return (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`transition-[filter] duration-500 ${loaded ? "blur-0" : "blur-sm"} ${className ?? ""}`}
            onLoad={handleVisible}
        />
    )
}
