import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Education {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("text")
  university: string;
  @Column("text")
  fieldOfStudy: string;
  @Column("float")
  gpa: number;
  @Column("date")
  startDate: Date;
  @Column("date")
  endDate: Date;
}
