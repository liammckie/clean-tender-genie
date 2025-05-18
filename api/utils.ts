export function validateEnvVars(requiredEnvVars: string[]): string[] {
  return requiredEnvVars.filter((name) => !process.env[name]);
}
