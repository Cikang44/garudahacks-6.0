"use client";

import { FormProvider, useForm } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { useAuth } from "@clerk/nextjs";

export default function UserWelcomeForm() {
    const form = useForm();
    const { userId } = useAuth();

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
                window.location.href = "/";
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
            <h1 className="text-2xl font-bold text-center mb-4">Welcome!</h1>
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="region"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel asChild>
                                    <h1 className="text-lg text-center font-semibold">Select your region</h1>
                                </FormLabel>
                                <FormControl>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <Button variant="outline" className="w-full">
                                                {field.value || "Select..."}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>Select...</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => field.onChange(0)}>
                                                Jawa Barat
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => field.onChange(1)}>
                                                Jawa Tengah
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onSelect={() => field.onChange(2)}>
                                                Jawa Timur
                                            </DropdownMenuItem>
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