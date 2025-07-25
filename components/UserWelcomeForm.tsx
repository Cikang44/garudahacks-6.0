"use client";

import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { TRegion } from "@/app/api/region/schema";
import { RegionDropdown } from "./RegionDropdown";

export default function UserWelcomeForm() {
    const form = useForm();
    const { userId } = useAuth();
    const router = useRouter();

    if (!userId) {
        return <div className="text-center text-red-500">You must be logged in to complete this form.</div>;
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
                                    <RegionDropdown field={field} />
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