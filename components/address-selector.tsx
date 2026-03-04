"use client"

import { useState, useEffect, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

// The structure of the JSON file
type BarangayList = string[]
type MunicipalityList = Record<string, { barangay_list: BarangayList }>
type ProvinceList = Record<string, { municipality_list: MunicipalityList }>
type RegionList = Record<string, { region_name: string; province_list: ProvinceList }>

export interface AddressData {
    region: string
    province: string
    city: string
    barangay: string
    street: string
}

interface AddressSelectorProps {
    value: AddressData
    onChange: (value: AddressData) => void
}

export function AddressSelector({ value, onChange }: AddressSelectorProps) {
    const [data, setData] = useState<RegionList | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/philippine_full.json")
                const json = await response.json()
                setData(json)
            } catch (error) {
                console.error("Failed to load address data:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [])

    const updateValue = (key: keyof AddressData, newValue: string) => {
        const defaultData = { ...value, [key]: newValue }
        if (key === "region") {
            defaultData.province = ""
            defaultData.city = ""
            defaultData.barangay = ""
        } else if (key === "province") {
            defaultData.city = ""
            defaultData.barangay = ""
        } else if (key === "city") {
            defaultData.barangay = ""
        }
        onChange(defaultData)
    }

    const REGION_NAMES: Record<string, string> = {
        "01": "Region I (Ilocos Region)",
        "02": "Region II (Cagayan Valley)",
        "03": "Region III (Central Luzon)",
        "4A": "Region IV-A (CALABARZON)",
        "4B": "Region IV-B (MIMAROPA)",
        "05": "Region V (Bicol Region)",
        "06": "Region VI (Western Visayas)",
        "07": "Region VII (Central Visayas)",
        "08": "Region VIII (Eastern Visayas)",
        "09": "Region IX (Zamboanga Peninsula)",
        "10": "Region X (Northern Mindanao)",
        "11": "Region XI (Davao Region)",
        "12": "Region XII (SOCCSKSARGEN)",
        "13": "Region XIII (Caraga)",
        "NCR": "National Capital Region (NCR)",
        "CAR": "Cordillera Administrative Region (CAR)",
        "BARMM": "Bangsamoro Autonomous Region in Muslim Mindanao (BARMM)",
    }

    // Derive options based on current selection
    const regions = useMemo(() => {
        if (!data) return []
        return Object.entries(data).map(([key, val]) => ({
            value: key,
            label: REGION_NAMES[key] || val.region_name,
        })).sort((a, b) => a.label.localeCompare(b.label))
    }, [data])

    const provinces = useMemo(() => {
        if (!data || !value.region) return []
        const provs = data[value.region]?.province_list || {}
        return Object.keys(provs).sort()
    }, [data, value.region])

    const cities = useMemo(() => {
        if (!data || !value.region || !value.province) return []
        const muns = data[value.region]?.province_list[value.province]?.municipality_list || {}
        return Object.keys(muns).sort()
    }, [data, value.region, value.province])

    const barangays = useMemo(() => {
        if (!data || !value.region || !value.province || !value.city) return []
        const brgys = data[value.region]?.province_list[value.province]?.municipality_list[value.city]?.barangay_list || []
        return [...brgys].sort()
    }, [data, value.region, value.province, value.city])

    if (isLoading) {
        return <div className="text-sm text-gray-500 py-4">Loading address data...</div>
    }

    return (
        <div className="space-y-4">
            <div className="grid gap-1.5">
                <Label>Region</Label>
                <Select value={value.region} onValueChange={(v) => updateValue("region", v)}>
                    <SelectTrigger className="h-11 bg-white border-[#E5E7EB]">
                        <SelectValue placeholder="Select Region" />
                    </SelectTrigger>
                    <SelectContent>
                        {regions.map((r) => (
                            <SelectItem key={r.value} value={r.value}>
                                {r.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-1.5">
                <Label>Province</Label>
                <Select value={value.province} onValueChange={(v) => updateValue("province", v)} disabled={!value.region}>
                    <SelectTrigger className="h-11 bg-white border-[#E5E7EB]">
                        <SelectValue placeholder="Select Province" />
                    </SelectTrigger>
                    <SelectContent>
                        {provinces.map((p) => (
                            <SelectItem key={p} value={p}>
                                {p}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-1.5">
                <Label>City / Municipality</Label>
                <Select value={value.city} onValueChange={(v) => updateValue("city", v)} disabled={!value.province}>
                    <SelectTrigger className="h-11 bg-white border-[#E5E7EB]">
                        <SelectValue placeholder="Select City/Municipality" />
                    </SelectTrigger>
                    <SelectContent>
                        {cities.map((c) => (
                            <SelectItem key={c} value={c}>
                                {c}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-1.5">
                <Label>Barangay</Label>
                <Select value={value.barangay} onValueChange={(v) => updateValue("barangay", v)} disabled={!value.city}>
                    <SelectTrigger className="h-11 bg-white border-[#E5E7EB]">
                        <SelectValue placeholder="Select Barangay" />
                    </SelectTrigger>
                    <SelectContent>
                        {barangays.map((b) => (
                            <SelectItem key={b} value={b}>
                                {b}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-1.5">
                <Label>House No., Street, Purok</Label>
                <Input
                    value={value.street}
                    onChange={(e) => updateValue("street", e.target.value)}
                    placeholder="e.g. 123 Main St., Purok 1"
                    className="h-11 bg-white border-[#E5E7EB]"
                />
            </div>
        </div>
    )
}
