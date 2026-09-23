import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum SpaceType {
  DESK = 'desk',
  MEETING_ROOM = 'meeting_room',
  PRIVATE_OFFICE = 'private_office',
}

@Entity('spaces')
export class Space {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama_space: string;

  @Column('double')
  harga_per_jam: number;

  @Column({ type: 'enum', enum: SpaceType })
  tipe: SpaceType;

  @Column()
  kapasitas: number;

  @Column({ nullable: true })
  foto: string;

  @Column('text')
  deskripsi: string;

  @Column()
  id_owner: number; // relasi ke SpaceOwner

  @Column()
  id_maker: number;

  @CreateDateColumn()
  created_at: Date;
}