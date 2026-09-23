import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('diskons')
export class Diskon {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama_diskon: string;

  @Column('double')
  persentase_diskon: number;

  @Column()
  tanggal_awal: Date;

  @Column()
  tanggal_akhir: Date;

  @Column()
  id_maker: number;
}