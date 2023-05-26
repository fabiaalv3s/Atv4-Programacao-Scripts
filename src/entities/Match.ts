import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Team } from "./Team";

@Entity({ name: "matches" })
export class Match {
  // define a chave primária como auto incremento
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Team, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'idHost',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_host_id'
  })
  idHost: Team;

  @ManyToOne((type) => Team, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'idVisitor',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'fk_visitor_id'
  })
  idVisitor: Team;

  @Column({ type: 'date'})
  date: Date;
}
