export class ApiError extends Error {
  public status: number;
  public code: string;
  public details: any;

  constructor(status: number, code: string, message: string, details: any = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}