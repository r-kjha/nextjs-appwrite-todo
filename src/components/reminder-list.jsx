"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  CalendarIcon, 
  MailIcon, 
  TrashIcon, 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  BellIcon
} from "lucide-react";
import ReminderService from "@/lib/reminders";

export function ReminderList({ userId, refreshTrigger }) {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load reminders
  const loadReminders = async () => {
    try {
      setLoading(true);
      const result = await ReminderService.getReminders(userId);
      setReminders(result.documents || []);
    } catch (error) {
      console.error('Error loading reminders:', error);
      setError("Failed to load reminders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Load reminders on mount and when refresh is triggered
  useEffect(() => {
    loadReminders();
  }, [userId, refreshTrigger]);

  // Delete reminder
  const deleteReminder = async (reminderId) => {
    if (!confirm("Are you sure you want to delete this reminder?")) {
      return;
    }

    try {
      await ReminderService.deleteReminder(reminderId);
      setReminders(prev => prev.filter(r => r.$id !== reminderId));
    } catch (error) {
      console.error('Error deleting reminder:', error);
      setError("Failed to delete reminder. Please try again.");
    }
  };

  // Cancel reminder
  const cancelReminder = async (reminderId) => {
    if (!confirm("Are you sure you want to cancel this reminder?")) {
      return;
    }

    try {
      const updatedReminder = await ReminderService.cancelReminder(reminderId);
      setReminders(prev =>
        prev.map(r => r.$id === reminderId ? updatedReminder : r)
      );
    } catch (error) {
      console.error('Error cancelling reminder:', error);
      setError("Failed to cancel reminder. Please try again.");
    }
  };

  // Get status icon and color
  const getStatusIcon = (reminder) => {
    const now = new Date();
    const reminderTime = new Date(reminder.reminderDateTime);

    if (reminder.status === 'sent') {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    } else if (reminder.status === 'cancelled') {
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    } else if (reminderTime < now) {
      return <AlertCircleIcon className="h-5 w-5 text-orange-500" />;
    } else {
      return <ClockIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getStatusText = (reminder) => {
    const now = new Date();
    const reminderTime = new Date(reminder.reminderDateTime);

    if (reminder.status === 'sent') {
      return 'Sent';
    } else if (reminder.status === 'cancelled') {
      return 'Cancelled';
    } else if (reminderTime < now) {
      return 'Overdue';
    } else {
      return 'Pending';
    }
  };

  const getStatusColor = (reminder) => {
    const now = new Date();
    const reminderTime = new Date(reminder.reminderDateTime);

    if (reminder.status === 'sent') {
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
    } else if (reminder.status === 'cancelled') {
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
    } else if (reminderTime < now) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300';
    } else {
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
    }
  };

  // Group reminders by status
  const pendingReminders = reminders.filter(r => r.status === 'pending' && new Date(r.reminderDateTime) > new Date());
  const overdueReminders = reminders.filter(r => r.status === 'pending' && new Date(r.reminderDateTime) <= new Date());
  const sentReminders = reminders.filter(r => r.status === 'sent');
  const cancelledReminders = reminders.filter(r => r.status === 'cancelled');

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading reminders...</p>
      </div>
    );
  }

  const ReminderCard = ({ reminder }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon(reminder)}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(reminder)}`}>
              {getStatusText(reminder)}
            </span>
          </div>
          
          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
            {reminder.subject}
          </h4>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {reminder.description}
          </p>
          
          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <MailIcon className="h-3 w-3" />
              <span>{reminder.email}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>
                {ReminderService.formatNepalTime(reminder.reminderDateTime, 'PPP p')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 ml-4">
          {reminder.status === 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => cancelReminder(reminder.$id)}
              className="text-orange-500 hover:text-orange-700 hover:bg-orange-50"
            >
              <XCircleIcon className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteReminder(reminder.$id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BellIcon className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          My Reminders
        </h3>
      </div>

      {error && (
        <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <div className="flex items-center">
            <ClockIcon className="h-4 w-4 text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-600">Pending</span>
          </div>
          <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
            {pendingReminders.length}
          </p>
        </div>
        
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircleIcon className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-sm font-medium text-orange-600">Overdue</span>
          </div>
          <p className="text-xl font-bold text-orange-900 dark:text-orange-100">
            {overdueReminders.length}
          </p>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-4 w-4 text-green-600 mr-2" />
            <span className="text-sm font-medium text-green-600">Sent</span>
          </div>
          <p className="text-xl font-bold text-green-900 dark:text-green-100">
            {sentReminders.length}
          </p>
        </div>
        
        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <div className="flex items-center">
            <XCircleIcon className="h-4 w-4 text-red-600 mr-2" />
            <span className="text-sm font-medium text-red-600">Cancelled</span>
          </div>
          <p className="text-xl font-bold text-red-900 dark:text-red-100">
            {cancelledReminders.length}
          </p>
        </div>
      </div>

      {/* Overdue Reminders */}
      {overdueReminders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="text-lg font-medium mb-4 flex items-center text-orange-600">
            <AlertCircleIcon className="h-5 w-5 mr-2" />
            Overdue Reminders ({overdueReminders.length})
          </h4>
          <div className="space-y-3">
            {overdueReminders.map((reminder) => (
              <ReminderCard key={reminder.$id} reminder={reminder} />
            ))}
          </div>
        </div>
      )}

      {/* Pending Reminders */}
      {pendingReminders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="text-lg font-medium mb-4 flex items-center text-blue-600">
            <ClockIcon className="h-5 w-5 mr-2" />
            Upcoming Reminders ({pendingReminders.length})
          </h4>
          <div className="space-y-3">
            {pendingReminders.map((reminder) => (
              <ReminderCard key={reminder.$id} reminder={reminder} />
            ))}
          </div>
        </div>
      )}

      {/* Sent Reminders */}
      {sentReminders.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="text-lg font-medium mb-4 flex items-center text-green-600">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Sent Reminders ({sentReminders.length})
          </h4>
          <div className="space-y-3">
            {sentReminders.slice(0, 5).map((reminder) => (
              <ReminderCard key={reminder.$id} reminder={reminder} />
            ))}
            {sentReminders.length > 5 && (
              <p className="text-sm text-gray-500 text-center">
                And {sentReminders.length - 5} more...
              </p>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {reminders.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
          <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No reminders yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Create your first reminder to get email notifications!
          </p>
        </div>
      )}
    </div>
  );
}
