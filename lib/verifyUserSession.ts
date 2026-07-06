import { jwtVerify } from "jose";

export async function verifyUserSession(cookieHeader: string | null): Promise<string | null> {
  if (!cookieHeader) return null;

  const accessToken = cookieHeader
    .split(";")
    .find((c) => c.trim().startsWith("shagun_user_access="))
    ?.split("=")[1];

  if (!accessToken) return null;

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(accessToken, secret);
    return typeof payload.id === "string" ? payload.id : null;
  } catch {
    return null;
  }
}
