export abstract class MatrixContractService {
  abstract init(): Promise<void>
  abstract start(): Promise<void>
  abstract createUser(): Promise<any>
  abstract createRoom({
    name,
    sellerName,
    buyerName,
  }: {
    name: string
    sellerName: string
    buyerName: string
  }): Promise<string>
}
