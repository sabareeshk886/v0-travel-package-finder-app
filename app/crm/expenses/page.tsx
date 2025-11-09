"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Receipt, Calendar, Tag, Building2 } from "lucide-react"
import { getExpenses } from "@/lib/crm-actions"
import Link from "next/link"

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")

  useEffect(() => {
    loadExpenses()
  }, [categoryFilter])

  const loadExpenses = async () => {
    setLoading(true)
    const filters: any = {}
    if (categoryFilter !== "all") filters.category = categoryFilter
    if (searchTerm) filters.search = searchTerm

    const result = await getExpenses(filters)
    if (result.success) {
      setExpenses(result.data)
    }
    setLoading(false)
  }

  const getCategoryColor = (category: string) => {
    const colors: any = {
      Hotel: "bg-blue-100 text-blue-700",
      Transport: "bg-green-100 text-green-700",
      Food: "bg-orange-100 text-orange-700",
      Guide: "bg-purple-100 text-purple-700",
      Activity: "bg-pink-100 text-pink-700",
      Other: "bg-gray-100 text-gray-700",
    }
    return colors[category] || "bg-gray-100 text-gray-700"
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Expenses</h1>
          <p className="text-muted-foreground">Track trip expenses and vendor payments</p>
        </div>
        <Link href="/crm/expenses/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Summary Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Expenses</p>
              <p className="text-3xl font-bold">₹{totalExpenses.toLocaleString()}</p>
            </div>
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <Receipt className="h-8 w-8 text-red-600" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by expense number or description..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadExpenses()}
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Hotel">Hotel</SelectItem>
                <SelectItem value="Transport">Transport</SelectItem>
                <SelectItem value="Food">Food</SelectItem>
                <SelectItem value="Guide">Guide</SelectItem>
                <SelectItem value="Activity">Activity</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadExpenses}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Expenses List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading expenses...</p>
        </div>
      ) : expenses.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No expenses found.</p>
            <Link href="/crm/expenses/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {expenses.map((expense) => (
            <Card key={expense.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{expense.expense_number}</h3>
                        <p className="text-sm text-muted-foreground">{expense.description}</p>
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium mt-2 ${getCategoryColor(expense.category)}`}
                        >
                          {expense.category}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(expense.expense_date).toLocaleDateString()}</span>
                      </div>
                      {expense.vendor && (
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>{expense.vendor.vendor_name}</span>
                        </div>
                      )}
                      {expense.trip && (
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span>{expense.trip.trip_number}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">₹{expense.amount.toLocaleString()}</p>
                    {expense.payment_mode && (
                      <p className="text-xs text-muted-foreground mt-1">{expense.payment_mode}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
