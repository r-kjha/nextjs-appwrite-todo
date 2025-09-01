"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import DatePicker from "react-datepicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { CalendarIcon, ClockIcon, MailIcon, BellIcon } from "lucide-react";
import ReminderService from "@/lib/reminders";
import "react-datepicker/dist/react-datepicker.css";

const reminderSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  subject: z
    .string()
    .min(1, "Subject is required")
    .max(200, "Subject must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  reminderDateTime: z
    .date()
    .refine((date) => date > new Date(), "Reminder must be set for a future time"),
  isRecurring: z.boolean().default(false),
});

export function ReminderForm({ userId, onReminderCreated, onCancel }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = useForm({
    resolver: zodResolver(reminderSchema),
    defaultValues: {
      email: "",
      subject: "",
      description: "",
      reminderDateTime: null,
      isRecurring: false,
    },
  });

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      setError("");

      // Validate the reminder
      const validation = ReminderService.validateReminder(data);
      if (!validation.isValid) {
        setError(Object.values(validation.errors).join(', '));
        return;
      }

      // Create the reminder
      const reminder = await ReminderService.createReminder(userId, data);
      
      console.log("Reminder created:", reminder);
      
      // Reset form
      form.reset();
      
      // Notify parent component
      if (onReminderCreated) {
        onReminderCreated(reminder);
      }
      
    } catch (error) {
      console.error("Error creating reminder:", error);
      setError(error.message || "Failed to create reminder. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get minimum date (current time + 1 minute in Nepal timezone)
  const getMinDate = () => {
    const now = ReminderService.getCurrentNepalTime();
    return new Date(now.getTime() + 60000); // Add 1 minute
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <BellIcon className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Create Reminder
        </h3>
      </div>

      {error && (
        <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <MailIcon className="h-4 w-4" />
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="recipient@example.com"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Email address where the reminder will be sent
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Subject Field */}
          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Meeting with team tomorrow"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description Field */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <textarea
                    className="w-full min-h-[100px] px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white resize-none"
                    placeholder="Detailed description of the reminder..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date and Time Picker */}
          <FormField
            control={form.control}
            name="reminderDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Reminder Date & Time
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Controller
                      name="reminderDateTime"
                      control={form.control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          showTimeSelect
                          timeFormat="HH:mm"
                          timeIntervals={15}
                          dateFormat="MMMM d, yyyy h:mm aa"
                          minDate={getMinDate()}
                          placeholderText="Select date and time"
                          className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                          calendarClassName="dark:bg-gray-800 dark:text-white"
                          popperClassName="z-50"
                        />
                      )}
                    />
                    <ClockIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </FormControl>
                <FormDescription>
                  Select date and time in Nepal Time (NPT)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Recurring Option */}
          <FormField
            control={form.control}
            name="isRecurring"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={field.onChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Recurring Reminder
                  </FormLabel>
                  <FormDescription>
                    Make this a recurring reminder (Note: Recurring functionality requires additional setup)
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating Reminder...
                </>
              ) : (
                <>
                  <BellIcon className="h-4 w-4 mr-2" />
                  Create Reminder
                </>
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Nepal Time Info */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          <ClockIcon className="inline h-4 w-4 mr-1" />
          Current Nepal Time: {ReminderService.formatNepalTime(new Date(), 'PPP p')}
        </p>
      </div>
    </div>
  );
}
