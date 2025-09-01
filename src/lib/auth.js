import { account } from './appwrite';
import { ID } from 'appwrite';

class AuthService {
    // Create a new account
    async createAccount({ email, password, name }) {
        try {
            const userAccount = await account.create(ID.unique(), email, password, name);
            if (userAccount) {
                // Automatically log in the user after account creation
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            throw error;
        }
    }

    // Login user
    async login({ email, password }) {
        try {
            return await account.createEmailPasswordSession(email, password);
        } catch (error) {
            throw error;
        }
    }

    // Get current user
    async getCurrentUser() {
        try {
            return await account.get();
        } catch (error) {
            return null;
        }
    }

    // Logout user
    async logout() {
        try {
            return await account.deleteSessions();
        } catch (error) {
            throw error;
        }
    }

    // Send password recovery email
    async forgotPassword(email) {
        try {
            return await account.createRecovery(
                email,
                `${window.location.origin}/reset-password`
            );
        } catch (error) {
            throw error;
        }
    }

    // Reset password
    async resetPassword({ userId, secret, password, confirmPassword }) {
        try {
            return await account.updateRecovery(
                userId,
                secret,
                password,
                confirmPassword
            );
        } catch (error) {
            throw error;
        }
    }

    // Update password
    async updatePassword({ oldPassword, newPassword }) {
        try {
            return await account.updatePassword(newPassword, oldPassword);
        } catch (error) {
            throw error;
        }
    }

    // Verify email
    async verifyEmail() {
        try {
            return await account.createVerification(
                `${window.location.origin}/verify-email`
            );
        } catch (error) {
            throw error;
        }
    }

    // Confirm email verification
    async confirmEmailVerification({ userId, secret }) {
        try {
            return await account.updateVerification(userId, secret);
        } catch (error) {
            throw error;
        }
    }

    // OAuth login
    async loginWithGoogle() {
        try {
            account.createOAuth2Session(
                'google',
                `${window.location.origin}/dashboard`,
                `${window.location.origin}/login`
            );
        } catch (error) {
            throw error;
        }
    }

    async loginWithGitHub() {
        try {
            account.createOAuth2Session(
                'github',
                `${window.location.origin}/dashboard`,
                `${window.location.origin}/login`
            );
        } catch (error) {
            throw error;
        }
    }

    // Get user preferences
    async getPrefs() {
        try {
            return await account.getPrefs();
        } catch (error) {
            throw error;
        }
    }

    // Update user preferences
    async updatePrefs(prefs) {
        try {
            return await account.updatePrefs(prefs);
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService();
