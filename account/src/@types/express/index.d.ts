export {};

declare global {
  namespace Express {
    interface Request {
      cpf: string;
    }
  }
}
