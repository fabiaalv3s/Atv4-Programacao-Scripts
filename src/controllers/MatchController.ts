import { Request, Response } from "express";
import AppDataSource from "../data-source";
import { Team } from "../entities/Team";
import { Match } from "../entities/Match";

class MatchController {
  public async create(req: Request, res: Response) {
    const { idHost, idVisitor, date } = req.body;

    if (!idHost || !idVisitor || !date) {
      return res.json({ error: "id do mandante, id do visitante e data de partida são necessários" });
    }

    if (idHost == idVisitor) {
      return res.json({ error: "id do mandante não pode ser igual ao id do visitante" });
    }

    if (!(new Date(date))) {
      return res.json({ error: "Data inválida, forneça a data em yyyy-mm-dd" });
    }

    const host: any = await AppDataSource.manager.findOneBy(Team, { id: idHost }).catch(e => {
      return { error: "id mandante inválido" };
    });

    if (!host || host.error) {
      return res.json({ error: "id visitante inválido" });
    }

    const visitor: any = await AppDataSource.manager.findOneBy(Team, { id: idVisitor }).catch(e => {
      return { error: "id visitante inválido" };
    });

    if (!visitor || visitor.error) {
      return res.json({ error: "id visitante inválido" });
    }

    const match = new Match();
    match.idHost = host;
    match.idVisitor = visitor;
    match.date = new Date(date);
    await AppDataSource.manager.save(Match, match);
    res.json(match);
  }

  public async edit(req: Request, res: Response) {
    const { id, idHost, idVisitor, date } = req.body;

    if (!id || !idHost || !idVisitor || !date) {
      return res.json({ error: "id do mandante, id do visitante e data de partida são necessários" });
    }

    if (idHost == idVisitor) {
      return res.json({ error: "id do mandante não pode ser igual ao id do visitante" });
    }

    if (!(new Date(date))) {
      return res.json({ error: "Data inválida, forneça a data em yyyy-mm-dd" });
    }

    const host: any = await AppDataSource.manager.findOneBy(Team, { id: idHost }).catch(e => {
      return { error: "Mandante desconhecido" };
    });

    if (!host || host.error) {
      return res.json({ error: "Mandante desconhecido" });
    }

    const visitor: any = await AppDataSource.manager.findOneBy(Team, { id: idVisitor }).catch(e => {
      return { error: "Visitante desconhecido" };
    });

    if (!visitor || visitor.error) {
      return res.json({ error: "Visitante desconhecido" });
    }

    const match: any = await AppDataSource.manager.findOneBy(Match, { id }).catch(e => {
      return { error: "Partida não encontrada" };
    });

    if (!match || match.error) {
      return res.json(match);
    }
    match.idHost = host;
    match.idVisitor = visitor;
    match.date = new Date(date);
    await AppDataSource.manager.save(Match, match);
    res.json(match);
  }

  public async getAll(req: Request, res: Response) {
    const r = await AppDataSource
      .manager
      .getRepository(Match)
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.idHost", "host")
      .leftJoinAndSelect("match.idVisitor", "visitor")
      .orderBy("match.date", "DESC")
      .getMany();
    return res.json(r);
  }

  public async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    const r = await AppDataSource
      .manager.find(Match, {
        relations: ['idHost', 'idVisitor'],
        where: [
          { idHost: { id: parsedId } },
          { idVisitor: { id: parsedId } }
        ]
      });
    return res.json(r);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    // obtém o id do usuário que foi salvo na autorização na middleware
    const { id } = req.body;
    const r = await AppDataSource
      .createQueryBuilder()
      .delete()
      .from(Match)
      .where("id=:id", { id })
      .execute()
    return res.json(r)
  }
}

export default new MatchController();