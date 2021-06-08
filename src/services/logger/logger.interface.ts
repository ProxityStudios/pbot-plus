export interface LoggerType {
  info: (message: string) => void;
  warn: (message: string) => void;
  error: (message: string, error?: any) => Promise<void>;
}
