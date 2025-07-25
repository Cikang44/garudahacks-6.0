import UserWelcomeForm from "@/components/UserWelcomeForm";

export default function Page() {
    return (
        <div className="absolute top-0 left-0 flex flex-col items-center justify-center min-h-screen min-w-screen bg-gray-100">
            <UserWelcomeForm />
        </div>
    );
}