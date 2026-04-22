import { User } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi, clearAuthToken, setAuthToken } from './api';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

class AuthService {
  private readonly TOKEN_KEY = 'foodza_auth_tokens';
  private readonly USER_KEY = 'foodza_user_data';
  private authState: AuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
  };

  constructor() {
    this.initializeAuth();
  }

  /**
   * Initialize authentication state from storage
   */
  private async initializeAuth(): Promise<void> {
    try {
      const tokens = await AsyncStorage.getItem(this.TOKEN_KEY);
      const userData = await AsyncStorage.getItem(this.USER_KEY);

      if (tokens && userData) {
        const parsedTokens: AuthTokens = JSON.parse(tokens);
        const parsedUser: User = JSON.parse(userData);

        this.authState = {
          user: parsedUser,
          tokens: parsedTokens,
          isAuthenticated: true,
        };

        setAuthToken(parsedTokens.accessToken);
      }
    } catch (error) {
      console.error('AuthService initialization error:', error);
      await this.clearAuthData();
    }
  }

  /**
   * Get current authentication state
   */
  getAuthState(): AuthState {
    return { ...this.authState };
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.authState.isAuthenticated;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.authState.user;
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.authState.tokens?.accessToken || null;
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await authApi.login(email, password);

      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Create token structure (assuming single token for now)
        const tokens: AuthTokens = {
          accessToken: token,
          refreshToken: token, // In production, these would be different
        };

        await this.saveAuthData(user, tokens);
        
        return { success: true, user };
      }

      return { 
        success: false, 
        error: response.error?.message || 'Login failed' 
      };
    } catch (error) {
      console.error('AuthService.login error:', error);
      return { 
        success: false, 
        error: 'Network error during login' 
      };
    }
  }

  /**
   * Register new user
   */
  async register(userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await authApi.register(userData);

      if (response.success && response.data) {
        const { user, token } = response.data;
        
        const tokens: AuthTokens = {
          accessToken: token,
          refreshToken: token,
        };

        await this.saveAuthData(user, tokens);
        
        return { success: true, user };
      }

      return { 
        success: false, 
        error: response.error?.message || 'Registration failed' 
      };
    } catch (error) {
      console.error('AuthService.register error:', error);
      return { 
        success: false, 
        error: 'Network error during registration' 
      };
    }
  }

  /**
   * Login with OTP
   */
  async loginWithOTP(email: string, otp: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const response = await authApi.verifyOTP(email, otp);

      if (response.success && response.data) {
        const { token } = response.data;
        
        // Get user profile after OTP verification
        const { userApi } = await import('./api');
        const userResponse = await userApi.getUserProfile('me'); // Assuming 'me' endpoint
        const user = userResponse.success ? userResponse.data : null;

        if (user) {
          const tokens: AuthTokens = {
            accessToken: token,
            refreshToken: token,
          };

          await this.saveAuthData(user, tokens);
          
          return { success: true, user };
        }
      }

      return { 
        success: false, 
        error: response.error?.message || 'OTP verification failed' 
      };
    } catch (error) {
      console.error('AuthService.loginWithOTP error:', error);
      return { 
        success: false, 
        error: 'Network error during OTP verification' 
      };
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await authApi.resetPassword(email);
      
      return { 
        success: response.success,
        error: response.error?.message 
      };
    } catch (error) {
      console.error('AuthService.requestPasswordReset error:', error);
      return { 
        success: false, 
        error: 'Network error during password reset request' 
      };
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<boolean> {
    try {
      if (!this.authState.tokens?.refreshToken) {
        return false;
      }

      const response = await authApi.refreshToken();

      if (response.success && response.data) {
        const newTokens: AuthTokens = {
          accessToken: response.data.token,
          refreshToken: this.authState.tokens.refreshToken,
        };

        await this.saveTokens(newTokens);
        return true;
      }

      return false;
    } catch (error) {
      console.error('AuthService.refreshAccessToken error:', error);
      return false;
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('AuthService.logout error:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  /**
   * Save authentication data
   */
  private async saveAuthData(user: User, tokens: AuthTokens): Promise<void> {
    this.authState = {
      user,
      tokens,
      isAuthenticated: true,
    };

    await Promise.all([
      AsyncStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens)),
      AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user)),
    ]);

    setAuthToken(tokens.accessToken);
  }

  /**
   * Save only tokens
   */
  private async saveTokens(tokens: AuthTokens): Promise<void> {
    this.authState.tokens = tokens;
    await AsyncStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokens));
    setAuthToken(tokens.accessToken);
  }

  /**
   * Clear all authentication data
   */
  private async clearAuthData(): Promise<void> {
    this.authState = {
      user: null,
      tokens: null,
      isAuthenticated: false,
    };

    await Promise.all([
      AsyncStorage.removeItem(this.TOKEN_KEY),
      AsyncStorage.removeItem(this.USER_KEY),
    ]);

    clearAuthToken();
  }

  /**
   * Update user data in auth state
   */
  updateUser(user: User): void {
    this.authState.user = user;
    AsyncStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;

// Export the class for static method access
export { AuthService };

