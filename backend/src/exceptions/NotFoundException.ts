import { HttpException } from './HttpException';

export class NotFoundException extends HttpException {
  constructor(id: string) {
    super(404, `Item with id ${id} has not been found`);
  }
}
