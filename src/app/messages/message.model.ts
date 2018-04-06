export class Message {
  constructor (
    public _id: string,
    public createdBy: string,
    public createdAt: Date,
    public body: string,
    public channel: string
  ) {}
}
