import * as jose from "jose";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "FATAL: JWT_SECRET environment variable is missing in production environment. Refusing to sign/verify tokens."
      );
    }
    return new TextEncoder().encode(
      "vea-compro-development-fallback-secret-key-32chars-min!"
    );
  }
  return new TextEncoder().encode(secret);
}

export async function signToken(payload: Record<string, unknown>) {
  const secret = getJwtSecret();
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const secret = getJwtSecret();
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}
