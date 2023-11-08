import axios from 'axios';

const tokenManager = {
  accessToken: null,
  refreshToken: process.env.REFRESH_TOKEN,
  expiresIn: null,
  isRefreshing: false,
  subscribers: [],

  async refreshAccessToken() {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      try {
        const response = await axios({
          method: 'post',
          url: process.env.MELI_AUTH_URL,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            refresh_token: this.refreshToken,
          }),
        });

        this.accessToken = response.data.access_token;
        this.refreshToken = response.data.refresh_token;
        this.expiresIn = new Date().getTime() + response.data.expires_in * 1000;
      } catch (error) {
        console.error('Error refreshing access token:', error);
        throw error;
      } finally {
        this.isRefreshing = false;
        this.onRefreshed(this.accessToken);
      }
    }
  },

  addSubscriber(callback) {
    this.subscribers.push(callback);
  },

  onRefreshed(accessToken) {
    this.subscribers.forEach((callback) => callback(accessToken));
    this.subscribers = [];
  },

  async getToken() {
    const now = new Date().getTime();
    const isExpired = !this.expiresIn || now >= this.expiresIn;

    if (!this.accessToken || isExpired) {
      await this.refreshAccessToken();
    }

    return this.accessToken;
  },
};

export default tokenManager;
