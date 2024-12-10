import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Language as Lang } from "../enums/language";
@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "enum", enum: Lang })
  name: Lang;
}
