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
      const response = await axios({
        method: 'post',
        url: process.env.MELI_AUTH_URL,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: new URLSearchParams({
          grant_type: process.env.GRANT_TYPE,
          client_id: process.env.CLIENT_ID,
          client_secret: process.env.CLIENT_SECRET,
          code: process.env.AUTHORIZATION_CODE,
          redirect_uri: process.env.REDIRECT_URI,
          code_verifier: process.env.CODE_VERIFIER,
        }),
      });

      this.accessToken = response.data.access_token;
      this.expiresIn = new Date().getTime() + response.data.expires_in * 1000;
      this.isRefreshing = false;
      this.onRrefreshed(this.accessToken);
    }
  },

  addSubscriber(callback) {
    this.subscribers.push(callback);
  },

  onRrefreshed(accessToken) {
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
