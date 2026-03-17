import * as jose from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "your-ultra-secure-development-placeholder-secret-key-32chars!";

export async function signToken(payload: any) {
  const secret = new TextEncoder().encode(JWT_SECRET);
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);
}

export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    return payload;
  } catch (err) {
    return null;
  }
}
