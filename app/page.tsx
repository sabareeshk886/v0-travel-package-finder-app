import PackageFinder from "@/components/package-finder"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Fernway Holidays</h1>
          <p className="text-muted-foreground">Package Rate Finder</p>
        </div>
        <PackageFinder />
      </div>
    </main>
  )
}
