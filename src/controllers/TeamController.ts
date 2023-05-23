import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Teams } from "../entities/Teams";

class TeamController {

  public async listTeam(req: Request, res: Response): Promise<Response> {

    try{
      const teams: any[] = await AppDataSource.getRepository(Teams).find({ order: { name: 'ASC' } })

      return res.status(200).json(teams)
    }catch(e){
      return res.status(500).json(e.message)
    }  
  }

  public async listByTermo(req: Request, res: Response): Promise<Response> {
    const { termo } = req.params

    try{
      const teams = await AppDataSource.getRepository(Teams).find({ order: { name: 'ASC' } })

      const teamsWithTermo = teams.filter(x=> x.name.toLowerCase().includes(termo.toLowerCase()))

      return res.status(200).json(teamsWithTermo)
    }catch(e){
      return res.status(500).json(e.message)
    }
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body

    try{
      const team = await AppDataSource.getRepository(Teams).save({ name }).catch(e => {
        return { error: e.message}
      });

        return res.status(200).json(team)
    }catch(e){
      let errorMessage = e.message
      if(errorMessage.includes("UNIQUE constraint")){
        errorMessage = "O nome já existe."
      }
      return res.status(500).json(errorMessage)
    }
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { id, name } = req.body

    try{
      const team = await AppDataSource.getRepository(Teams).findOneBy({ id })

      if(!team) return res.status(404).json('Time não encontrado')

      team.name = name

      const updatedTeam = await AppDataSource.getRepository(Teams).save(team)

      return res.status(200).json(updatedTeam)
    }catch(e){
      let errorMessage = e.message
      if(errorMessage.includes("UNIQUE constraint")){
        errorMessage = "O nome já existe."
      }
      return res.status(500).json(errorMessage)
    }
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.body

    try{
      const team = await AppDataSource.getRepository(Teams).findOneBy({ id })

      if(!team) return res.status(404).json('Time não encontrado')

      await AppDataSource.getRepository(Teams).delete(team)

      return res.status(200).json(`Time ${team.name} deletado!`)
    }catch(e){
      return res.status(500).json(e.message)
    }
  }
}

export default new TeamController();