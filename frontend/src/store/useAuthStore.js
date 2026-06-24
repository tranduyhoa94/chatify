import { create } from 'zustand';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: false,
    isLoading: false,
    isSigningUp: false,
    checkAuth: async () => {
        set({ isCheckingAuth: true, isLoading: true });
        try {
            const response = await axiosInstance.get('/auth/check');
            set({ authUser: response.data, isCheckingAuth: false, isLoading: false });
        } catch (error) {
            console.error('Error checking auth:', error);
            set({ authUser: null, isCheckingAuth: false, isLoading: false });
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post('/auth/signup', data);
            set({ authUser: res.data.newUser, isSigningUp: false });
            toast.success(res.data.message);
            return true;
        } catch (error) {
            console.error('Error signing up:', error);
            set({ authUser: null, isSigningUp: false });
            toast.error(error.response?.data?.message ?? 'Sign up failed');
            return false;
        }
    },
    signout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
            set({ authUser: null });
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Error logging out:', error);
            toast.error('Failed to logout');
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true });
        try {
          const res = await axiosInstance.post("/auth/login", data);
          set({ authUser: res.data.user });
          toast.success("Logged in successfully");
          return true;
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isLoggingIn: false });
        }
      },
}));