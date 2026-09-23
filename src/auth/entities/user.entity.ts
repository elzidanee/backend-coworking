import { Entity, PrimaryGeneratedColumn, Column, OneToOne, CreateDateColumn } from 'typeorm';

export enum UserRole {
  MEMBER = 'member',
  ADMIN_SPACE = 'admin_space',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  // Penting untuk multi-tenancy: setiap user "milik" satu maker (siswa)
  @Column()
  id_maker: number;

  @CreateDateColumn()
  created_at: Date;
}