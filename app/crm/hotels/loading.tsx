import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function HotelsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <div className="bg-muted rounded w-48 h-8 animate-pulse" />
          <div className="bg-muted mt-2 rounded w-64 h-4 animate-pulse" />
        </div>
        <div className="bg-muted rounded w-32 h-10 animate-pulse" />
      </div>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="bg-muted rounded w-2/3 h-6" />
              <div className="bg-muted mt-2 rounded w-1/2 h-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="bg-muted rounded w-full h-4" />
                <div className="bg-muted rounded w-3/4 h-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
