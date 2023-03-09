import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserPermission {
  ADMIN = 'admin',
  STANDARD = 'standard',
}

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserPermission,
    default: UserPermission.STANDARD,
  })
  permission: UserPermission;

  @Column()
  phone: string;
}
