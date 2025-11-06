// Global variable for thread TTL in minutes
// Default: 60 minutes
let threadTTLMinutes: number = 60;

export function getThreadTTLMinutes(): number {
  return threadTTLMinutes;
}

export function setThreadTTLMinutes(minutes: number): void {
  if (minutes <= 0) {
    throw new Error('TTL must be a positive number');
  }
  threadTTLMinutes = minutes;
}

