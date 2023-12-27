import { Injectable } from '@nestjs/common';
import { UpdateUserDTO } from './dtos/update-user.dto';
import { BaseService } from 'src/common/services/base-service.service';

@Injectable()
export class UsersService extends BaseService<{}, UpdateUserDTO> {
  public entity: string = 'users';
  constructor() {
    super();
  }

  async deleteUser(id: string) {
    return this.delete(id);
  }

  async updateUser(id: string, dto: UpdateUserDTO) {
    return this.edit(id, dto);
  }

  async findUserById(id: string) {
    return this.select(id);
  }

  async findUsers() {
    return this.selectAll(0, 10);
  }
}
