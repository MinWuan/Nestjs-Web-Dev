import * as crypto from 'crypto';
import { config } from "@/config.app";

const ALGORITHM = "aes-256-cbc";

// Key SHA-256 (32 bytes)
const key = crypto.createHash("sha256").update(config.ENCRYPTION_KEY).digest();

// IV 16 bytes
const iv = Buffer.from((config.ENCRYPTION_IV || "").padEnd(16, " ").slice(0, 16), "utf8");

export function encryptJSON(data: any): string {
  const json = JSON.stringify(data);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(json, "utf8"), cipher.final()]);
  return encrypted.toString("base64");
}


export function decryptJSON<T = any>(encrypted: string): T {
  const encryptedBuffer = Buffer.from(encrypted, "base64");
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  const decrypted = Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
  return JSON.parse(decrypted.toString("utf8"));
}