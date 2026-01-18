"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { RoomType, RoomStatus } from "@/lib/types"
import { X } from "lucide-react"

export function RoomsFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [type, setType] = useState(searchParams.get("type") || "all")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (type && type !== "all") params.set("type", type)
    if (status && status !== "all") params.set("status", status)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    router.push(`/admin/rooms?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setType("all")
    setStatus("all")
    setMinPrice("")
    setMaxPrice("")
    router.push("/admin/rooms")
  }

  const hasFilters = search || (type && type !== "all") || (status && status !== "all") || minPrice || maxPrice

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          <Input
            placeholder="Search rooms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="lg:col-span-2"
          />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="Room Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value={RoomType.STANDARD}>Standard</SelectItem>
              <SelectItem value={RoomType.DELUXE}>Deluxe</SelectItem>
              <SelectItem value={RoomType.SUITE}>Suite</SelectItem>
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value={RoomStatus.AVAILABLE}>Available</SelectItem>
              <SelectItem value={RoomStatus.OCCUPIED}>Occupied</SelectItem>
              <SelectItem value={RoomStatus.MAINTENANCE}>Maintenance</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          {hasFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
