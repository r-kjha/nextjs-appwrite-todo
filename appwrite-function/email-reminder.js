// Appwrite Function for Email Reminders
// Runtime: Node.js 18
// Trigger: Schedule (every minute) or HTTP

const sdk = require('node-appwrite');

// Initialize Appwrite client
const client = new sdk.Client()
    .setEndpoint(process.env.APPWRITE_FUNCTION_ENDPOINT)
    .setProject(process.env.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

const databases = new sdk.Databases(client);

// Email configuration (use your preferred email service)
const nodemailer = require('nodemailer');

// Configure your email transporter
const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
});

module.exports = async ({ req, res, log, error }) => {
    try {
        log('Email reminder function started');

        const DATABASE_ID = process.env.DATABASE_ID || 'todos_db';
        const REMINDERS_COLLECTION_ID = process.env.REMINDERS_COLLECTION_ID || 'reminders';

        // Get current time
        const now = new Date();
        log(`Checking for reminders due at: ${now.toISOString()}`);

        // Query for due reminders
        const dueReminders = await databases.listDocuments(
            DATABASE_ID,
            REMINDERS_COLLECTION_ID,
            [
                sdk.Query.equal('status', 'pending'),
                sdk.Query.equal('emailSent', false),
                sdk.Query.lessThanEqual('reminderDateTime', now.toISOString())
            ]
        );

        log(`Found ${dueReminders.documents.length} due reminders`);

        let sentCount = 0;
        let errorCount = 0;

        // Process each due reminder
        for (const reminder of dueReminders.documents) {
            try {
                // Send email
                const mailOptions = {
                    from: process.env.FROM_EMAIL || process.env.SMTP_USERNAME,
                    to: reminder.email,
                    subject: `Reminder: ${reminder.subject}`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                            <h2 style="color: #333;">Reminder Notification</h2>
                            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
                                <h3 style="color: #2563eb; margin-top: 0;">${reminder.subject}</h3>
                                <p style="color: #666; line-height: 1.6;">${reminder.description}</p>
                            </div>
                            <div style="color: #888; font-size: 12px; text-align: center; margin-top: 30px;">
                                <p>This reminder was scheduled for: ${new Date(reminder.reminderDateTime).toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })} (Nepal Time)</p>
                                <p>Sent via your personal reminder system</p>
                            </div>
                        </div>
                    `
                };

                await transporter.sendMail(mailOptions);
                log(`Email sent successfully to ${reminder.email}`);

                // Update reminder status
                await databases.updateDocument(
                    DATABASE_ID,
                    REMINDERS_COLLECTION_ID,
                    reminder.$id,
                    {
                        emailSent: true,
                        status: 'sent',
                        sentAt: now.toISOString()
                    }
                );

                sentCount++;

            } catch (emailError) {
                error(`Failed to send email for reminder ${reminder.$id}: ${emailError.message}`);
                errorCount++;

                // Optionally update reminder with error status
                try {
                    await databases.updateDocument(
                        DATABASE_ID,
                        REMINDERS_COLLECTION_ID,
                        reminder.$id,
                        {
                            status: 'failed',
                            lastError: emailError.message
                        }
                    );
                } catch (updateError) {
                    error(`Failed to update error status: ${updateError.message}`);
                }
            }
        }

        const result = {
            success: true,
            message: `Processed ${dueReminders.documents.length} reminders`,
            sent: sentCount,
            errors: errorCount,
            timestamp: now.toISOString()
        };

        log(JSON.stringify(result));

        return res.json(result);

    } catch (functionError) {
        error(`Function error: ${functionError.message}`);
        
        return res.json({
            success: false,
            error: functionError.message,
            timestamp: new Date().toISOString()
        }, 500);
    }
};

/* 
Environment Variables needed in Appwrite Function:
- APPWRITE_FUNCTION_ENDPOINT
- APPWRITE_FUNCTION_PROJECT_ID  
- APPWRITE_API_KEY
- DATABASE_ID
- REMINDERS_COLLECTION_ID
- SMTP_HOST
- SMTP_PORT
- SMTP_USERNAME
- SMTP_PASSWORD
- FROM_EMAIL

Package.json dependencies:
{
  "dependencies": {
    "node-appwrite": "^9.0.0",
    "nodemailer": "^6.9.7"
  }
}
*/
