"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TodoManager } from "@/components/todo-manager";
import { ReminderManager } from "@/components/reminder-manager";

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {user.name}!
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0 space-y-8">
          {/* User Information Section */}
          <div className="border-4 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Welcome to your Dashboard!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You have successfully logged in with Appwrite authentication.
              </p>
              
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-md mx-auto">
                <h3 className="text-lg font-semibold mb-4">User Information</h3>
                <div className="space-y-2 text-left">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>User ID:</strong> {user.$id}</p>
                  <p><strong>Email Verified:</strong> {user.emailVerification ? "Yes" : "No"}</p>
                  <p><strong>Account Created:</strong> {new Date(user.$createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {!user.emailVerification && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 text-sm">
                    Your email is not verified. Please check your inbox for a verification email.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reminder Manager Section */}
          <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-6">
            <ReminderManager userId={user.$id} />
          </div>

          {/* Todo Manager Section */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
            <TodoManager userId={user.$id} />
          </div>
        </div>
      </main>
    </div>
  );
}
