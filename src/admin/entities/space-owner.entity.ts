import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity.js';

@Entity('space_owners')
export class SpaceOwner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama_coworking: string;

  @Column()
  nama_pemilik: string;

  @Column()
  telp: string;

  @Column({ type: 'text', nullable: true })
  deskripsi: string;

  @Column()
  id_user: number;

  @OneToOne(() => User)
  @JoinColumn({ name: 'id_user' })
  user: User;

  @Column()
  id_maker: number;
}