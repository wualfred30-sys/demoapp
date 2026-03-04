import Image from "next/image"

interface BrandLogoProps {
    variant?: "icon" | "full"
    className?: string
}

export function BrandLogo({ variant = "full", className }: BrandLogoProps) {
    if (variant === "icon") {
        return (
            <Image
                src="/images/linkod-app-logo-main.png"
                alt="Linkod App"
                width={40}
                height={40}
                priority
                className={className ?? "h-10 w-10 object-contain"}
            />
        )
    }

    return (
        <div className={`flex items-center gap-2 ${className ?? ""}`}>
            <Image
                src="/images/linkod-app-logo-main.png"
                alt="Linkod App"
                width={32}
                height={32}
                priority
                className="h-8 w-8 object-contain"
            />
            <span className="font-bold text-lg tracking-tight text-foreground">
                Linkod App
            </span>
        </div>
    )
}
