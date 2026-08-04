// Single shared key that remembers which page the user was trying to reach
// when they got sent to /auth. Whichever gated action fires last overwrites
// it, so after signing in the user lands back on what they actually wanted.
const AUTH_REDIRECT_KEY = "shagun_auth_redirect";

export function setAuthRedirect(path) {
  if (typeof window === "undefined" || !path) return;
  try {
    localStorage.setItem(AUTH_REDIRECT_KEY, path);
  } catch {
    // localStorage unavailable — user just lands on the default page after signin
  }
}

export function consumeAuthRedirect(fallback = "/collection") {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem(AUTH_REDIRECT_KEY);
    localStorage.removeItem(AUTH_REDIRECT_KEY);
    return stored || fallback;
  } catch {
    return fallback;
  }
}

