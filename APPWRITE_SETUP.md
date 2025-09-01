# Appwrite Database Setup Guide

Follow these steps to set up the database for the todo functionality:

## 1. Create Database

1. Go to your Appwrite Console
2. Navigate to **Databases** in the sidebar
3. Click **Create Database**
4. Name: `todos_db` (or use your preferred name)
5. Database ID: `todos_db` (copy this to your .env.local)

## 2. Create Collection

1. Inside your database, click **Create Collection**
2. Name: `todos`
3. Collection ID: `todos` (copy this to your .env.local)

## 3. Create Attributes

Add the following attributes to your `todos` collection:

### String Attributes
- **title** (required)
  - Type: String
  - Size: 100
  - Required: Yes

- **description** (optional)
  - Type: String
  - Size: 500
  - Required: No

- **userId** (required)
  - Type: String
  - Size: 50
  - Required: Yes

### Boolean Attributes
- **completed** (required)
  - Type: Boolean
  - Required: Yes
  - Default: false

**Note:** You don't need to create `createdAt` and `updatedAt` attributes as Appwrite automatically provides `$createdAt` and `$updatedAt` fields for all documents.

## 4. Create Indexes

Add these indexes for better query performance:

1. **userId_index**
   - Type: Key
   - Attribute: userId
   - Order: ASC

2. **completed_index**
   - Type: Key
   - Attribute: completed
   - Order: ASC

3. **createdAt_index**
   - Type: Key
   - Attribute: $createdAt
   - Order: DESC

4. **updatedAt_index**
   - Type: Key
   - Attribute: $updatedAt
   - Order: DESC

## 5. Set Permissions

Configure the following permissions for the collection:

### Create Documents
- Role: Users
- Permission: Create
- This allows any authenticated user to create todos

### Read Documents
- Role: Users
- Permission: Read
- This allows authenticated users to read their own todos

### Update Documents
- Role: Users
- Permission: Update
- This allows users to update their own todos

### Delete Documents
- Role: Users
- Permission: Delete
- This allows users to delete their own todos

**Important:** Make sure to set document-level permissions so users can only access their own todos. You can do this by adding a rule that checks `userId` equals the current user's ID.

## 6. Update Environment Variables

Update your `.env.local` file with the correct IDs:

```env
NEXT_PUBLIC_APPWRITE_DATABASE_ID=todos_db
NEXT_PUBLIC_APPWRITE_TODOS_COLLECTION_ID=todos
```

## 7. Test the Setup

1. Start your development server: `npm run dev`
2. Login to your application
3. Go to the dashboard
4. Try creating, completing, and deleting todos

## Troubleshooting

### Common Issues:

1. **Permission Denied Error**
   - Check that your collection permissions allow the authenticated user to create/read/update/delete
   - Verify that the userId field matches the current user's ID

2. **Document Not Found**
   - Ensure the database ID and collection ID in your environment variables match what you created
   - Check that the attributes are created with the correct names and types

3. **Validation Errors**
   - Make sure required attributes (title, userId, createdAt, updatedAt, completed) are being sent
   - Check that string lengths don't exceed the defined limits

### Security Best Practices:

1. **User Isolation**: Ensure users can only access their own todos by filtering on `userId`
2. **Input Validation**: The frontend validates input, but consider server-side validation rules
3. **Rate Limiting**: Consider implementing rate limiting for create/update operations
4. **Data Sanitization**: Ensure user input is properly sanitized

## Optional Enhancements

Consider adding these features:

1. **Categories/Tags**: Add a categories attribute for organizing todos
2. **Due Dates**: Add a dueDate attribute for deadline tracking
3. **Priority Levels**: Add a priority attribute (low/medium/high)
4. **Attachments**: Use Appwrite Storage for file attachments
5. **Real-time Updates**: Implement Appwrite's real-time subscriptions for live updates

After completing this setup, your todo functionality should work seamlessly with Appwrite!
