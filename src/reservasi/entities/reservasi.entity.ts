import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ReservasiStatus {
  BELUM_DIKONFIRM = 'belum_dikonfirm',
  DISETUJUI = 'disetujui',
  AKTIF = 'aktif',
  SELESAI = 'selesai',
  DIBATALKAN = 'dibatalkan',
}

@Entity('reservasis')
export class Reservasi {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  kode_booking: string;

  @Column()
  id_member: number;

  @Column()
  id_space: number;

  @Column({ nullable: true })
  id_diskon: number;

  @Column({ type: 'date' })
  tanggal_reservasi: string;

  @Column()
  jam_mulai: string; // format HH:mm

  @Column()
  jam_selesai: string;

  @Column()
  durasi_jam: number;

  @Column('double')
  harga_per_jam: number;

  @Column('double')
  total_harga_awal: number;

  @Column('double', { default: 0 })
  potongan_diskon: number;

  @Column('double')
  total_bayar: number;

  @Column({ type: 'enum', enum: ReservasiStatus, default: ReservasiStatus.BELUM_DIKONFIRM })
  status: ReservasiStatus;

  @Column({ nullable: true })
  check_in_time: Date;

  @Column({ nullable: true })
  check_out_time: Date;

  @Column()
  id_maker: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}