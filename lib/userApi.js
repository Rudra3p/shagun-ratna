import axios from 'axios';

// Public storefront API client. The site has no user accounts — everything under
// /api/user is public catalog data — so there's no auth refresh or sign-in redirect
// to handle here; callers deal with their own errors.
const userApi = axios.create({
  baseURL: '/api/user',
});

export default userApi;
