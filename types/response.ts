export class Response {
  public success: boolean;
  public data: any;
  public message?: string;

  public constructor(data: any, success: boolean = true, message?: string) {
    this.success = success;
    this.data = data;
    this.message = message;
  }
}
