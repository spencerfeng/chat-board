export class Channel {
  constructor (
    public _id: string,
    public name: string,
    public createdBy: string,
    public deletable: boolean,
    public isDefault: boolean,
    public createdAt: Date
  ) {}
}
