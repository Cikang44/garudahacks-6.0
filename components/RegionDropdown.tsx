"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import useSWR from "swr";
import { TRegion } from "@/app/api/region/schema";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function RegionDropdown({ field }: { field: any }) {
    const { data, error, isLoading } = useSWR("/api/region", fetcher);
    const regions: TRegion[] = data || [];

    if (error) {
        return <div className="text-center text-red-500">Failed to load regions.</div>;
    } else if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant="outline" className="w-full">
                    {regions.find(region => region.id === field.value)?.name || "Select..."}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Select...</DropdownMenuLabel>
                {regions.map((region) => (
                    <DropdownMenuItem
                        key={region.id}
                        onSelect={() => field.onChange(region.id)}
                    >
                        {region.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}