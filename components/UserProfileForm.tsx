"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Mail, Phone } from "lucide-react"
import { currentUser } from "@clerk/nextjs/server"
import { RegionDropdown } from "@/components/RegionDropdown"
import { useCallback, useState } from "react"
import { Button } from "./ui/button"
import { UserProfile } from "@clerk/nextjs"

export default function UserProfileForm({ clerkId, imageUrl, fullName, firstName, lastName, email, appUser }: { clerkId: string; imageUrl: string; fullName: string; firstName: string; lastName: string; email: string; appUser: any }) {

    const [isLoading, setIsLoading] = useState(false);
    const [appUserRegionId, setAppUserRegionId] = useState(appUser?.daerahId || null);
    const [showProfile, setShowProfile] = useState(false);

    const onDropdownChange = useCallback(async (regionId: string) => {
        setIsLoading(true);
        try {
            await fetch("/api/auth", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ clerkId: clerkId, daerahId: regionId })
            });
        } catch (error) {
            console.error("Failed to update region:", error);
        } finally {
            setIsLoading(false);
            setAppUserRegionId(regionId);
        }
    }, [clerkId]);

    return (
        <Card>
            <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={imageUrl} alt="Profile" />
                        <AvatarFallback>
                            {firstName?.[0]}{lastName?.[0]}
                        </AvatarFallback>
                    </Avatar>
                </div>
                <CardTitle className="text-2xl">
                    {fullName || `${firstName} ${lastName}`}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>Region:</span>
                    <div className="flex items-center">
                        <RegionDropdown field={{ value: isLoading ? null : appUserRegionId, onChange: onDropdownChange }} />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{email}</span>
                </div>
                <div>
                    <Button onClick={() => setShowProfile(true)}>Open Clerk Profile</Button>
                    {showProfile && (
                        <div
                            className="fixed inset-0 bg-opacity-10 flex items-center justify-center z-50"
                            onClick={() => setShowProfile(false)}
                        >
                            <div onClick={(e) => e.stopPropagation()}>
                                <UserProfile />
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}