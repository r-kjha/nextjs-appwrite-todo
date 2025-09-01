import DatabaseService from './database';
import { ID } from 'appwrite';
import { toZonedTime, fromZonedTime, format } from 'date-fns-tz';

// Database configuration
const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'todos_db';
const REMINDERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_REMINDERS_COLLECTION_ID || 'reminders';

// Nepal timezone
const NEPAL_TIMEZONE = 'Asia/Kathmandu';

class ReminderService {
    // Create a new reminder
    async createReminder(userId, reminderData) {
        try {
            // Convert Nepal time to UTC for storage
            const utcDateTime = fromZonedTime(
                new Date(reminderData.reminderDateTime),
                NEPAL_TIMEZONE
            );

            const data = {
                email: reminderData.email,
                subject: reminderData.subject,
                description: reminderData.description,
                reminderDateTime: utcDateTime.toISOString(),
                userId,
                status: 'pending',
                timezone: NEPAL_TIMEZONE,
                isRecurring: reminderData.isRecurring || false,
                emailSent: false
            };

            return await DatabaseService.createDocument(
                DATABASE_ID,
                REMINDERS_COLLECTION_ID,
                data,
                ID.unique()
            );
        } catch (error) {
            console.error('Error creating reminder:', error);
            throw error;
        }
    }

    // Get all reminders for a user
    async getReminders(userId) {
        try {
            const query = DatabaseService.createQuery();
            const result = await DatabaseService.listDocuments(
                DATABASE_ID,
                REMINDERS_COLLECTION_ID,
                [
                    query.equal('userId', userId),
                    query.orderDesc('$createdAt')
                ]
            );

            // Convert UTC times back to Nepal time for display
            const reminders = result.documents.map(reminder => ({
                ...reminder,
                reminderDateTimeLocal: toZonedTime(
                    new Date(reminder.reminderDateTime),
                    NEPAL_TIMEZONE
                )
            }));

            return { ...result, documents: reminders };
        } catch (error) {
            console.error('Error fetching reminders:', error);
            throw error;
        }
    }

    // Get upcoming reminders
    async getUpcomingReminders(userId, limit = 5) {
        try {
            const query = DatabaseService.createQuery();
            const now = new Date();
            
            return await DatabaseService.listDocuments(
                DATABASE_ID,
                REMINDERS_COLLECTION_ID,
                [
                    query.equal('userId', userId),
                    query.equal('status', 'pending'),
                    query.greaterThan('reminderDateTime', now.toISOString()),
                    query.orderAsc('reminderDateTime'),
                    query.limit(limit)
                ]
            );
        } catch (error) {
            console.error('Error fetching upcoming reminders:', error);
            throw error;
        }
    }

    // Get overdue reminders
    async getOverdueReminders(userId) {
        try {
            const query = DatabaseService.createQuery();
            const now = new Date();
            
            return await DatabaseService.listDocuments(
                DATABASE_ID,
                REMINDERS_COLLECTION_ID,
                [
                    query.equal('userId', userId),
                    query.equal('status', 'pending'),
                    query.lessThan('reminderDateTime', now.toISOString()),
                    query.orderDesc('reminderDateTime')
                ]
            );
        } catch (error) {
            console.error('Error fetching overdue reminders:', error);
            throw error;
        }
    }

    // Update reminder
    async updateReminder(reminderId, updates) {
        try {
            // If updating reminderDateTime, convert to UTC
            if (updates.reminderDateTime) {
                updates.reminderDateTime = fromZonedTime(
                    new Date(updates.reminderDateTime),
                    NEPAL_TIMEZONE
                ).toISOString();
            }

            return await DatabaseService.updateDocument(
                DATABASE_ID,
                REMINDERS_COLLECTION_ID,
                reminderId,
                updates
            );
        } catch (error) {
            console.error('Error updating reminder:', error);
            throw error;
        }
    }

    // Mark reminder as sent
    async markAsSent(reminderId) {
        try {
            return await this.updateReminder(reminderId, {
                emailSent: true,
                status: 'sent',
                sentAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('Error marking reminder as sent:', error);
            throw error;
        }
    }

    // Cancel reminder
    async cancelReminder(reminderId) {
        try {
            return await this.updateReminder(reminderId, {
                status: 'cancelled'
            });
        } catch (error) {
            console.error('Error cancelling reminder:', error);
            throw error;
        }
    }

    // Delete reminder
    async deleteReminder(reminderId) {
        try {
            return await DatabaseService.deleteDocument(
                DATABASE_ID,
                REMINDERS_COLLECTION_ID,
                reminderId
            );
        } catch (error) {
            console.error('Error deleting reminder:', error);
            throw error;
        }
    }

    // Get reminders due for processing (for backend function)
    async getDueReminders() {
        try {
            const query = DatabaseService.createQuery();
            const now = new Date();
            
            return await DatabaseService.listDocuments(
                DATABASE_ID,
                REMINDERS_COLLECTION_ID,
                [
                    query.equal('status', 'pending'),
                    query.equal('emailSent', false),
                    query.lessThanEqual('reminderDateTime', now.toISOString())
                ]
            );
        } catch (error) {
            console.error('Error fetching due reminders:', error);
            throw error;
        }
    }

    // Format date for Nepal timezone display
    formatNepalTime(date, formatString = 'PPP p') {
        const nepalTime = toZonedTime(new Date(date), NEPAL_TIMEZONE);
        return format(nepalTime, formatString, { timeZone: NEPAL_TIMEZONE });
    }

    // Get current Nepal time
    getCurrentNepalTime() {
        return toZonedTime(new Date(), NEPAL_TIMEZONE);
    }

    // Convert Nepal time to UTC
    nepalTimeToUtc(nepalTime) {
        return fromZonedTime(new Date(nepalTime), NEPAL_TIMEZONE);
    }

    // Validate reminder data
    validateReminder(reminderData) {
        const errors = {};

        if (!reminderData.email || !/\S+@\S+\.\S+/.test(reminderData.email)) {
            errors.email = 'Valid email is required';
        }

        if (!reminderData.subject || reminderData.subject.trim().length === 0) {
            errors.subject = 'Subject is required';
        }

        if (!reminderData.description || reminderData.description.trim().length === 0) {
            errors.description = 'Description is required';
        }

        if (!reminderData.reminderDateTime) {
            errors.reminderDateTime = 'Reminder date and time is required';
        } else {
            const reminderDate = new Date(reminderData.reminderDateTime);
            const now = this.getCurrentNepalTime();
            
            if (reminderDate <= now) {
                errors.reminderDateTime = 'Reminder time must be in the future';
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
}

export default new ReminderService();
