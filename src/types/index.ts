export interface EmailProvider {
  name: string;
  send(request: { to: string; subject: string; body: string }): Promise<void>;
}
