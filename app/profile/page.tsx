import { currentUser } from "@clerk/nextjs/server"
import UserProfileForm from "@/components/UserProfileForm"
import { db } from "@/lib/db";
import { usersTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function ProfilePage() {
    const user = await currentUser();

    if (!user) {
        return <div>Please sign in to view your profile.</div>;
    }
    const userId = user?.id;
    const appUser = await db.query.usersTable.findFirst({
        where: eq(usersTable.clerkId, userId),
    });
    if (!appUser) {
        return <div>User not found in the database.</div>;
    }

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <UserProfileForm
                clerkId={userId}
                imageUrl={user.imageUrl || ''}
                fullName={user.fullName || ''}
                firstName={user.firstName || ''}
                lastName={user.lastName || ''}
                email={user.primaryEmailAddress?.emailAddress || ''}
                appUser={appUser}
            />
        </div>
    )
}