import { FileText, Clock, CheckCircle, CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatCardProps {
    icon: React.ElementType
    label: string
    value: string | number
    accent?: boolean
}

function StatCard({ icon: Icon, label, value, accent }: StatCardProps) {
    return (
        <Card className="border-border/50 shadow-none">
            <CardContent className="p-4 flex flex-col gap-2">
                <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${accent
                            ? "bg-[#00FFCC]/15 text-[#00CCAA]"
                            : "bg-muted text-muted-foreground"
                        }`}
                >
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
                <p className="text-xs text-muted-foreground leading-tight">{label}</p>
            </CardContent>
        </Card>
    )
}

interface StatsGridProps {
    totalRequests?: number
    pendingRequests?: number
    approvedRequests?: number
    requestsThisMonth?: number
}

export function StatsGrid({
    totalRequests = 0,
    pendingRequests = 0,
    approvedRequests = 0,
    requestsThisMonth = 0,
}: StatsGridProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            <StatCard
                icon={FileText}
                label="Total Requests"
                value={totalRequests}
            />
            <StatCard
                icon={Clock}
                label="Pending"
                value={pendingRequests}
            />
            <StatCard
                icon={CheckCircle}
                label="Approved"
                value={approvedRequests}
                accent
            />
            <StatCard
                icon={CalendarDays}
                label="This Month"
                value={requestsThisMonth}
            />
        </div>
    )
}
