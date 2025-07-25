"use client";

import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useSWR from "swr";
import { TRegion } from "@/app/api/region/schema";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function UserWelcomeForm() {
    const form = useForm();
    const { userId } = useAuth();
    const router = useRouter();
    const { data, error, isLoading } = useSWR("/api/region", fetcher);
    const regions: TRegion[] = data || [];

    if (!userId) {
        return <div className="text-center text-red-500">You must be logged in to complete this form.</div>;
    } else if (error) {
        return <div className="text-center text-red-500">Failed to load regions.</div>;
    } else if (isLoading) {
        return <div className="text-center">Loading...</div>;
    }

    const onSubmit = async (data: any) => {
        try {
            const response = await fetch("/api/auth", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ clerkId: userId, ...data }),
            });

            if (!response.ok) {
                throw new Error("Failed to submit form");
            } else {
                router.push("/");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="min-w-md p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold text-center mb-4">Welcome!</h1>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="daerahId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel asChild>
                                    <h1 className="text-lg text-center font-semibold">Select your region</h1>
                                </FormLabel>
                                <FormControl>
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
                                </FormControl>
                                <FormMessage />
                                <div className="flex justify-end">
                                    <Button type="submit" className="mt-4" disabled={form.formState.isSubmitting}>
                                        {form.formState.isSubmitting ? "Loading..." : "Submit"}
                                    </Button>
                                </div>
                            </FormItem>
                        )}
                    />
                </form>
            </FormProvider>
        </div>
    );
}