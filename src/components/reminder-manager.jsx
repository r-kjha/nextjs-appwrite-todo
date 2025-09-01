"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, BellIcon } from "lucide-react";
import { ReminderForm } from "./reminder-form";
import { ReminderList } from "./reminder-list";

export function ReminderManager({ userId }) {
  const [showForm, setShowForm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleReminderCreated = (reminder) => {
    console.log("New reminder created:", reminder);
    setShowForm(false);
    // Trigger refresh of reminder list
    setRefreshTrigger(prev => prev + 1);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Email Reminders
          </h2>
        </div>
        
        {!showForm && (
          <Button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            New Reminder
          </Button>
        )}
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-400">
        Schedule email reminders for important events. All times are in Nepal Time (NPT).
      </p>

      {/* Form */}
      {showForm && (
        <ReminderForm
          userId={userId}
          onReminderCreated={handleReminderCreated}
          onCancel={handleCancel}
        />
      )}

      {/* Reminder List */}
      <ReminderList userId={userId} refreshTrigger={refreshTrigger} />
    </div>
  );
}
