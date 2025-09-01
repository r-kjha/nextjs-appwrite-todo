# Email & Reminder System Setup Guide

## 1. Email Configuration in Appwrite

### Option A: Using Appwrite Cloud (Recommended)
If you're using Appwrite Cloud, email is pre-configured and you can send emails directly using Functions.

### Option B: Self-hosted Appwrite (SMTP Setup)
If you're self-hosting Appwrite, you need to configure SMTP:

1. **Update your `.env` file in Appwrite server**:
   ```env
   _APP_SMTP_HOST=smtp.gmail.com
   _APP_SMTP_PORT=587
   _APP_SMTP_SECURE=tls
   _APP_SMTP_USERNAME=your-email@gmail.com
   _APP_SMTP_PASSWORD=your-app-password
   ```

2. **Popular SMTP Providers**:
   - **Gmail**: smtp.gmail.com:587 (TLS)
   - **SendGrid**: smtp.sendgrid.net:587
   - **Mailgun**: smtp.mailgun.org:587
   - **AWS SES**: email-smtp.region.amazonaws.com:587

## 2. Database Schema for Reminders

Create a new collection called `reminders` with these attributes:

### String Attributes:
- **email** (required) - Size: 100
- **subject** (required) - Size: 200
- **description** (required) - Size: 1000
- **userId** (required) - Size: 50
- **status** (required) - Size: 20, Default: "pending"
- **timezone** (required) - Size: 50, Default: "Asia/Kathmandu"

### DateTime Attributes:
- **reminderDateTime** (required) - The scheduled time for reminder
- **sentAt** (optional) - When the email was sent

### Boolean Attributes:
- **isRecurring** (required) - Default: false
- **emailSent** (required) - Default: false

## 3. Appwrite Functions for Email Sending

You'll need to create an Appwrite Function to handle email sending:

### Function Trigger Options:
1. **Scheduled Function**: Runs every minute to check for due reminders
2. **HTTP Function**: Triggered manually or via webhook
3. **Database Trigger**: Triggered when reminder is created/updated

### Function Runtime:
- Node.js 18+ (recommended)
- Python 3.9+
- PHP 8+

## 4. Implementation Strategy

### Frontend:
1. Calendar/DateTime picker with Nepal timezone
2. Reminder form with email, subject, description
3. Reminder list/management interface

### Backend:
1. Reminder service for CRUD operations
2. Appwrite Function for email processing
3. Timezone handling for Nepal Time (Asia/Kathmandu)

### Email Processing:
1. Function checks for due reminders every minute
2. Sends email via SMTP
3. Updates reminder status
4. Handles recurring reminders

## 5. Security Considerations

- User can only create/view their own reminders
- Email validation
- Rate limiting for reminder creation
- Input sanitization for email content

## 6. Nepal Time (NPT) Handling

Nepal Time is UTC+5:45, which requires special handling:
- Use `Asia/Kathmandu` timezone
- Convert user input to UTC for storage
- Convert back to NPT for display

## Next Steps:
1. Set up email configuration in Appwrite
2. Create reminders collection
3. Install datetime picker packages
4. Create reminder service and components
5. Implement Appwrite Function for email sending

Would you like me to start implementing these components?
