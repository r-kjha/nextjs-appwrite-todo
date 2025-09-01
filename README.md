# Next.js with Appwrite Authentication

A modern Next.js application with Appwrite backend-as-a-service integration, featuring authentication, database operations, and file storage capabilities.

## Features

- 🔐 **Authentication**: Complete auth system with login, register, password reset
- 🎨 **Modern UI**: Built with Shadcn UI components and Tailwind CSS
- 📱 **Responsive**: Mobile-first design that works on all devices
- ⚡ **Fast**: Built with Next.js 15 and React 19
- 🛡️ **Type Safe**: Form validation with Zod and React Hook Form
- 🔄 **Real-time**: Appwrite real-time subscriptions ready
- 📁 **File Storage**: Appwrite storage integration
- 🗄️ **Database**: Appwrite database operations

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **UI Components**: Shadcn UI, Radix UI
- **Forms**: React Hook Form, Zod validation  
- **Backend**: Appwrite (Authentication, Database, Storage)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

1. Node.js 18+ installed
2. An Appwrite account (sign up at [cloud.appwrite.io](https://cloud.appwrite.io))

### Setup

1. **Clone and install dependencies**:
   ```bash
   git clone <your-repo>
   cd nextjs
   npm install
   ```

2. **Set up Appwrite**:
   - Create a new project in Appwrite Console
   - Go to Settings > General and copy your Project ID
   - Add your domain to the list of platforms (e.g., `localhost`, `localhost:3000`)

3. **Configure environment variables**:
   - Copy `.env.example` to `.env.local`
   - Update the values:
   ```env
   NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
   NEXT_PUBLIC_APPWRITE_PROJECT_ID=your_project_id_here
   ```

4. **Enable Authentication (in Appwrite Console)**:
   - Go to Auth > Settings
   - Enable Email/Password authentication
   - Configure your security settings as needed
   - Optional: Enable OAuth providers (Google, GitHub, etc.)

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── dashboard/         # Protected dashboard page
│   ├── register/          # Registration page
│   ├── layout.js          # Root layout with AuthProvider
│   └── page.js            # Login page
├── components/            # React components
│   ├── ui/               # Shadcn UI components
│   ├── login-form.jsx    # Login form component
│   └── register-form.jsx # Registration form component
├── contexts/             # React contexts
│   └── AuthContext.jsx  # Authentication context
└── lib/                  # Utility libraries
    ├── appwrite.js       # Appwrite client configuration
    ├── auth.js           # Authentication service
    ├── database.js       # Database service
    └── utils.js          # Utility functions
```

## Available Features

### Authentication
- ✅ Email/Password login and registration
- ✅ Password validation with requirements
- ✅ Form validation with error handling
- ✅ Auto-redirect after login/logout
- ✅ User session management
- ✅ Password visibility toggle
- 🔄 Password reset (ready to implement)
- 🔄 Email verification (ready to implement)
- 🔄 OAuth providers (ready to implement)

### Database Operations
The `DatabaseService` class provides:
- Create, read, update, delete documents
- Advanced querying with filters and sorting
- Pagination support
- Search functionality
- User-specific document retrieval

### File Storage
Ready-to-use methods for:
- File upload with permissions
- File download and preview
- File listing and management
- Image optimization

## Usage Examples

### Using Authentication
```jsx
import { useAuth } from '@/contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, loading } = useAuth();
  
  // Check if user is logged in
  if (user) {
    return <div>Welcome, {user.name}!</div>;
  }
  
  return <LoginForm />;
}
```

### Database Operations
```javascript
import DatabaseService from '@/lib/database';

// Create a document
const document = await DatabaseService.createDocument(
  'database_id',
  'collection_id',
  { title: 'My Post', content: 'Hello World!' }
);

// Query documents
const query = DatabaseService.createQuery();
const posts = await DatabaseService.listDocuments(
  'database_id',
  'collection_id',
  [query.equal('published', true), query.orderDesc('$createdAt')]
);
```

### File Upload
```javascript
import DatabaseService from '@/lib/database';

// Upload a file
const file = await DatabaseService.uploadFile(
  'bucket_id',
  fileObject
);

// Get file preview URL
const previewUrl = DatabaseService.getFilePreview(
  'bucket_id',
  file.$id,
  800,  // width
  600   // height
);
```

## Extending the Application

### Add Database Collections
1. Create collections in Appwrite Console
2. Set up attributes and indexes
3. Configure permissions
4. Use `DatabaseService` to interact with your collections

### Add OAuth Authentication
1. Configure OAuth providers in Appwrite Console
2. Use the built-in OAuth methods:
   ```javascript
   const { loginWithGoogle, loginWithGitHub } = useAuth();
   ```

### Add Real-time Features
```javascript
import client from '@/lib/appwrite';

// Subscribe to document changes
const unsubscribe = client.subscribe(
  'databases.DATABASE_ID.collections.COLLECTION_ID.documents',
  response => {
    console.log('Real-time update:', response);
  }
);
```

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_APPWRITE_ENDPOINT` | Appwrite server endpoint | Yes |
| `NEXT_PUBLIC_APPWRITE_PROJECT_ID` | Your Appwrite project ID | Yes |
| `APPWRITE_API_KEY` | Server-side API key (optional) | No |

## Security Considerations

- Environment variables are properly configured for client/server
- Form inputs are validated on both client and server side
- Appwrite handles authentication security best practices
- CORS is configured through Appwrite Console
- All API calls are made through the official Appwrite SDK

## Deployment

This app can be deployed on:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Any platform supporting Next.js

Make sure to:
1. Set environment variables in your deployment platform
2. Add your production domain to Appwrite Console
3. Update CORS settings if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

- [Next.js Documentation](https://nextjs.org/docs)
- [Appwrite Documentation](https://appwrite.io/docs)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
