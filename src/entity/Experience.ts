import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { EmploymentType } from "../enums/employmentType";
import { LocationType } from "../enums/locationType";

@Entity()
export class Experience {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("text")
  jobTitle: string;
  @Column({ type: "enum", enum: EmploymentType })
  employmentType: EmploymentType;
  @Column("text")
  companyName: string;
  @Column("text")
  location: string;
  @Column({ type: "enum", enum: LocationType })
  locationType: LocationType;
  @Column("bool")
  stillWorking: boolean;
  @Column("date")
  startDate: Date;
  @Column("date")
  endDate: Date;
}
