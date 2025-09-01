"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import AuthService from '@/lib/auth';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkUserStatus();
    }, []);

    const checkUserStatus = async () => {
        try {
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials) => {
        setLoading(true);
        try {
            const session = await AuthService.login(credentials);
            const userData = await AuthService.getCurrentUser();
            setUser(userData);
            return { success: true, data: userData };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const register = async (userData) => {
        setLoading(true);
        try {
            const session = await AuthService.createAccount(userData);
            const user = await AuthService.getCurrentUser();
            setUser(user);
            return { success: true, data: user };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await AuthService.logout();
            setUser(null);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        } finally {
            setLoading(false);
        }
    };

    const forgotPassword = async (email) => {
        try {
            await AuthService.forgotPassword(email);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const resetPassword = async (data) => {
        try {
            await AuthService.resetPassword(data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const updatePassword = async (data) => {
        try {
            await AuthService.updatePassword(data);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const verifyEmail = async () => {
        try {
            await AuthService.verifyEmail();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const confirmEmailVerification = async (data) => {
        try {
            await AuthService.confirmEmailVerification(data);
            await checkUserStatus(); // Refresh user data
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const loginWithGoogle = async () => {
        try {
            await AuthService.loginWithGoogle();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const loginWithGitHub = async () => {
        try {
            await AuthService.loginWithGitHub();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        updatePassword,
        verifyEmail,
        confirmEmailVerification,
        loginWithGoogle,
        loginWithGitHub,
        checkUserStatus,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
