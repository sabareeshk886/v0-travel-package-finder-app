"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Search, Receipt, Calendar, CreditCard, DollarSign } from "lucide-react"
import { getPayments } from "@/lib/crm-actions"
import Link from "next/link"

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  useEffect(() => {
    loadPayments()
  }, [typeFilter])

  const loadPayments = async () => {
    setLoading(true)
    const filters: any = {}
    if (typeFilter !== "all") filters.type = typeFilter
    if (searchTerm) filters.search = searchTerm

    const result = await getPayments(filters)
    if (result.success) {
      setPayments(result.data)
    }
    setLoading(false)
  }

  const getTypeColor = (type: string) => {
    const colors: any = {
      advance: "bg-blue-100 text-blue-700",
      balance: "bg-purple-100 text-purple-700",
      full: "bg-green-100 text-green-700",
      refund: "bg-orange-100 text-orange-700",
      received: "bg-teal-100 text-teal-700",
    }
    return colors[type] || "bg-gray-100 text-gray-700"
  }

  const totalReceived = payments.filter((p) => p.payment_type !== "refund").reduce((sum, p) => sum + (p.amount || 0), 0)

  const totalRefunded = payments.filter((p) => p.payment_type === "refund").reduce((sum, p) => sum + (p.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Track customer payments and refunds</p>
        </div>
        <Link href="/crm/payments/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Record Payment
          </Button>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Received</p>
                <p className="text-2xl font-bold">₹{totalReceived.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Refunded</p>
                <p className="text-2xl font-bold">₹{totalRefunded.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Amount</p>
                <p className="text-2xl font-bold">₹{(totalReceived - totalRefunded).toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Receipt className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by customer name or reference..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && loadPayments()}
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Payment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="advance">Advance</SelectItem>
                <SelectItem value="balance">Balance</SelectItem>
                <SelectItem value="full">Full Payment</SelectItem>
                <SelectItem value="refund">Refund</SelectItem>
                <SelectItem value="received">Received</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadPayments}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Payments List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading payments...</p>
        </div>
      ) : payments.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No payments found.</p>
            <Link href="/crm/payments/new">
              <Button className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Record Payment
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {payments.map((payment) => (
            <Card key={payment.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{payment.customer_name}</h3>
                        <p className="text-sm text-muted-foreground">Payment ID: {payment.id.slice(0, 8)}...</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getTypeColor(payment.payment_type)}`}
                          >
                            {payment.payment_type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(payment.payment_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>{payment.payment_mode}</span>
                      </div>
                      {payment.transaction_reference && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs">Ref: {payment.transaction_reference}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">₹{payment.amount.toLocaleString()}</p>
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
