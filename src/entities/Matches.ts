import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Teams } from "./Teams";

@Entity({name: "matches"})
export class Matches{
    @PrimaryGeneratedColumn()
    id: number
    @Column({ nullable: false, type: 'date', default:()=>"CURRENT_TIMESTAMP" })
    date: Date
    @ManyToOne((type) => Teams, {onDelete: "CASCADE"})
    @JoinColumn({
        name: "idhost",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_host_id"
    })
    host: Teams
    @ManyToOne((type) => Teams, {onDelete: "CASCADE"})
    @JoinColumn({
        name: "idvisitor",
        referencedColumnName: "id",
        foreignKeyConstraintName: "fk_visitor_id"
    })
    visitor: Teams
}