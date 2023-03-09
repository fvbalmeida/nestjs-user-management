import { UserDomain } from '../domain/user.domain';

export interface UserInterface {
  create(user: UserDomain): Promise<UserDomain>;

  findAll(req: any): Promise<UserDomain[]>;

  findByNameOrEmail(searchString: string): Promise<UserDomain[]>;

  findByEmail(email: string): Promise<UserDomain>;

  findById(id: number, req: any): Promise<UserDomain>;

  update(id: number, user: UserDomain, req: any): Promise<UserDomain>;

  remove(id: number, req: any): Promise<void>;
}
