import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity.js';

@Entity('members')
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama_member: string;

  @Column()
  instansi: string;

  @Column('text')
  alamat: string;

  @Column()
  telp: string;

  @Column({ nullable: true })
  foto: string;

  @Column()
  id_user: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column()
  id_maker: number;

  @CreateDateColumn()
  created_at: Date;
}