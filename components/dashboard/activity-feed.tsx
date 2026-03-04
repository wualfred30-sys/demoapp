import { FileText, CheckCircle, Clock, AlertCircle } from "lucide-react"

type ActivityStatus = "approved" | "pending" | "processing" | "rejected"

interface ActivityItem {
    id: string
    type: string
    description: string
    date: string
    status: ActivityStatus
}

const MOCK_ACTIVITY: ActivityItem[] = [
    {
        id: "1",
        type: "Certificate",
        description: "Barangay Clearance request submitted",
        date: "Today, 9:02 AM",
        status: "pending",
    },
    {
        id: "2",
        type: "ID",
        description: "QR ID application approved",
        date: "Yesterday, 3:15 PM",
        status: "approved",
    },
    {
        id: "3",
        type: "Certificate",
        description: "Certificate of Residency issued",
        date: "Mar 2, 11:30 AM",
        status: "approved",
    },
    {
        id: "4",
        type: "Blotter",
        description: "Blotter report under review",
        date: "Mar 1, 8:00 AM",
        status: "processing",
    },
]

const statusConfig: Record<
    ActivityStatus,
    { icon: React.ElementType; color: string; label: string }
> = {
    approved: {
        icon: CheckCircle,
        color: "text-[#00CCAA]",
        label: "Approved",
    },
    pending: {
        icon: Clock,
        color: "text-amber-500",
        label: "Pending",
    },
    processing: {
        icon: Clock,
        color: "text-blue-500",
        label: "Processing",
    },
    rejected: {
        icon: AlertCircle,
        color: "text-destructive",
        label: "Rejected",
    },
}

export function ActivityFeed() {
    return (
        <div className="flex flex-col gap-1">
            {MOCK_ACTIVITY.map((item) => {
                const { icon: StatusIcon, color, label } = statusConfig[item.status]
                return (
                    <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-xl px-3 py-3 hover:bg-muted/50 transition-colors"
                    >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted mt-0.5">
                            <FileText className="h-4 w-4 text-muted-foreground" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground leading-snug truncate">
                                {item.description}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.date}</p>
                        </div>
                        <div className={`flex items-center gap-1 shrink-0 ${color}`}>
                            <StatusIcon className="h-4 w-4" strokeWidth={1.75} />
                            <span className="text-xs font-medium hidden sm:block">{label}</span>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

