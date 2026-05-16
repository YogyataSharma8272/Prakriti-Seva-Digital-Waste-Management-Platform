import axios from 'axios';

// API Service for Frontend
// This file handles all API calls to the backends

const CORE_API_BASE_URL = import.meta.env.VITE_CORE_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/api';
const COMMERCE_API_BASE_URL = import.meta.env.VITE_COMMERCE_API_BASE_URL || 'http://localhost:4000/api';
const isBrowser = typeof window !== 'undefined';
const isRemoteDeployment = isBrowser && !['localhost', '127.0.0.1'].includes(window.location.hostname);

class ApiService {
  constructor() {
    this.coreClient = axios.create({
      baseURL: CORE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.commerceClient = axios.create({
      baseURL: COMMERCE_API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.token = localStorage.getItem('authToken');

    this.coreClient.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  // Set token after login
  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userData', JSON.stringify(user));
  }

  // Remove token on logout
  clearToken() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userData');
  }

  // Make API request
  async request(client, endpoint, options = {}) {
    try {
      const response = await client.request({
        url: endpoint,
        ...options,
      });
      return response.data;
    } catch (error) {
      const isNetworkError = !error?.response;
      const isCommerceClient = client === this.commerceClient;
      const validationErrors = error?.response?.data?.errors;
      if (isNetworkError && isCommerceClient) {
        const method = String(options.method || 'GET').toUpperCase();
        const currentProducts = readDemoCommerceProducts();

        if (method === 'GET' && endpoint.startsWith('/products')) {
          return endpoint === '/products' ? currentProducts : currentProducts.find((product) => String(product.id) === endpoint.split('/').pop()) || null;
        }

        if (method === 'POST' && endpoint === '/products') {
          const created = {
            id: `demo-product-${Date.now()}`,
            ...options.data,
          };
          writeDemoCommerceProducts([created, ...currentProducts]);
          return created;
        }

        if (method === 'DELETE' || method === 'PUT') {
          if (method === 'DELETE') {
            const productId = endpoint.split('/').pop();
            writeDemoCommerceProducts(currentProducts.filter((product) => String(product.id) !== String(productId)));
          } else if (method === 'PUT') {
            const productId = endpoint.split('/').pop();
            const updatedProducts = currentProducts.map((product) => (
              String(product.id) === String(productId)
                ? { ...product, ...options.data, id: product.id }
                : product
            ));
            writeDemoCommerceProducts(updatedProducts);
          }

          return { success: true };
        }

        if (endpoint === '/checkout') {
          return {
            url: '/mock-checkout-success?orderId=demo-order',
            order: {
              id: 'demo-order',
              status: 'created',
            },
          };
        }
      }

      const message =
        (isNetworkError && isRemoteDeployment && CORE_API_BASE_URL.includes('localhost') ? `Backend URL is still set to ${CORE_API_BASE_URL}. Set VITE_CORE_API_BASE_URL in Vercel to your live backend URL.` : null) ||
        (isNetworkError && isCommerceClient ? 'Commerce server unavailable. Run `npm run dev:server` (or `npm run dev:admin`) and try again.' : null) ||
        (isNetworkError ? 'Server unavailable. Please start backend services and retry.' : null) ||
        (Array.isArray(validationErrors) && validationErrors.length > 0 ? validationErrors.join(', ') : null) ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'API request failed';
      console.error('API Error:', message);
      throw new Error(message);
    }
  }

  // ==================== AUTHENTICATION ====================

  async register(userData) {
    return this.request(this.coreClient, '/auth/register', {
      method: 'POST',
      data: userData,
    });
  }

  async login(email, password) {
    return this.request(this.coreClient, '/auth/login', {
      method: 'POST',
      data: { email, password },
    });
  }

  async googleLogin(credential) {
    return this.request(this.coreClient, '/auth/google', {
      method: 'POST',
      data: { credential },
    });
  }

  async sendLoginOtp(email) {
    return this.request(this.coreClient, '/auth/send-login-otp', {
      method: 'POST',
      data: { email },
    });
  }

  async verifyLoginOtp(email, otp) {
    return this.request(this.coreClient, '/auth/verify-login-otp', {
      method: 'POST',
      data: { email, otp },
    });
  }

  async forgotPassword(email) {
    return this.request(this.coreClient, '/auth/forgot-password', {
      method: 'POST',
      data: { email },
    });
  }

  async resetPassword(email, otp, newPassword) {
    return this.request(this.coreClient, '/auth/reset-password', {
      method: 'POST',
      data: { email, otp, newPassword },
    });
  }

  async getCurrentUser() {
    return this.request(this.coreClient, '/users/profile');
  }

  async updateProfile(profileData) {
    return this.request(this.coreClient, '/users/profile', {
      method: 'PUT',
      data: profileData,
    });
  }

  async getUserDashboard() {
    return this.request(this.coreClient, '/users/dashboard');
  }

  // ==================== PRODUCTS ====================

  async getProducts(category = null) {
    const url = category ? `/products?category=${category}` : '/products';
    return this.request(this.coreClient, url);
  }

  async getProduct(id) {
    return this.request(this.coreClient, `/products/${id}`);
  }

  async createProduct(productData) {
    return this.request(this.coreClient, '/products', {
      method: 'POST',
      data: productData,
    });
  }

  async updateProduct(id, productData) {
    return this.request(this.coreClient, `/products/${id}`, {
      method: 'PUT',
      data: productData,
    });
  }

  async deleteProduct(id) {
    return this.request(this.coreClient, `/products/${id}`, {
      method: 'DELETE',
    });
  }

  async createCheckoutSession(orderData) {
    return this.request(this.commerceClient, '/checkout', {
      method: 'POST',
      data: orderData,
    });
  }

  // ==================== PAYMENTS (RAZORPAY) ====================

  async createRazorpayOrder(orderData) {
    return this.request(this.coreClient, '/payment/create-razorpay-order', {
      method: 'POST',
      data: orderData,
    });
  }

  async verifyRazorpayPayment(paymentData) {
    return this.request(this.coreClient, '/payment/verify-razorpay-payment', {
      method: 'POST',
      data: paymentData,
    });
  }

  async getOrders() {
    return this.request(this.coreClient, '/payment');
  }

  async getOrder(id) {
    return this.request(this.coreClient, `/payment/${id}`);
  }

  // ==================== WASTE COLLECTION ====================

  async requestWastePickup(wasteData) {
    return this.request(this.coreClient, '/pickups/create', {
      method: 'POST',
      data: wasteData,
    });
  }

  async getMyWasteCollections() {
    return this.request(this.coreClient, '/pickups/my');
  }

  async getAllWasteCollections(status = null) {
    const url = status ? `/pickups/all?status=${status}` : '/pickups/all';
    return this.request(this.coreClient, url);
  }

  async updateWasteStatus(id, status) {
    return this.request(this.coreClient, `/pickups/status/${id}`, {
      method: 'PUT',
      data: { status },
    });
  }

  // ==================== LEADERBOARD ====================

  async getLeaderboard() {
    return this.request(this.coreClient, '/leaderboard');
  }

  async getUserRank(userId) {
    return this.request(this.coreClient, `/leaderboard/rank/${userId}`);
  }

  // ==================== HEALTH CHECK ====================

  async healthCheck() {
    return this.request(this.coreClient, '/health');
  }
}

// Export singleton instance
export default new ApiService();
