import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function NewHotelLoading() {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="bg-muted rounded w-10 h-10 animate-pulse" />
        <div>
          <div className="bg-muted rounded w-48 h-8 animate-pulse" />
          <div className="bg-muted mt-2 rounded w-64 h-4 animate-pulse" />
        </div>
      </div>

      <Card className="animate-pulse">
        <CardHeader>
          <div className="bg-muted rounded w-1/3 h-6" />
          <div className="bg-muted mt-2 rounded w-1/2 h-4" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="gap-4 grid grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-muted rounded h-10" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
