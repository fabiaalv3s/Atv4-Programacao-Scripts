import AppDataSource from "../data-source";
import { Request, Response } from 'express';
import { Team } from '../entities/Team';

class TeamController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { name } = req.body;
    //verifica se foram fornecidos os parâmetros
    if (!name) {
      return res.json({ error: "e-mail e senha necessários" });
    }
    const obj = new Team();
    obj.name = name;
    // o hook BeforeInsert não é disparado com AppDataSource.manager.save(User,JSON),
    // mas é disparado com AppDataSource.manager.save(User,objeto do tipo User)
    // https://github.com/typeorm/typeorm/issues/5493
    const usuario: any = await AppDataSource.manager.save(Team, obj).catch((e) => {
      // testa se o e-mail é repetido
      if (/(name)[\s\S]+(already exists)/.test(e.detail)) {
        return { error: 'O nome já existe' };
      }
      return { error: e.message };
    })
    if (usuario.id) {
      // cria um token codificando o objeto {idusuario,mail}
      // retorna o token para o cliente
      return res.json({
        id: usuario.id,
        nome: usuario.name
      });
    }
    return res.json(usuario);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    // obtém o id do usuário que foi salvo na autorização na middleware
    const { id } = req.body;
    const r = await AppDataSource
      .createQueryBuilder()
      .delete()
      .from(Team)
      .where("id=:id", { id })
      .execute()
    return res.json(r)
  }

  // o usuário pode atualizar somente os seus dados
  public async update(req: Request, res: Response): Promise<Response> {
    const { name, id } = req.body;
    const team: any = await AppDataSource.manager.findOneBy(Team, { id }).catch((e) => {
      return { error: "Identificador inválido" };
    })
    if (team && team.id) {
      if (name !== "") {
        team.name = name;
      }
      const r = await AppDataSource.manager.save(Team, team).catch((e) => {
        // testa se o e-mail é repetido
        if (/(name)[\s\S]+(already exists)/.test(e.detail)) {
          return ({ error: 'nome já existe' });
        }
        return e;
      })
      if (!r.error) {
        return res.json({ id: team.id, name: team.name });
      }
      return res.json(r);
    }
    else if (team && team.error) {
      return res.json(name)
    }
    else {
      return res.json({ error: "Time não localizado" });
    }
  }

  public async get(req: Request, res: Response): Promise<Response> {
    const { id } = req.body;
        if (id) {
      const r = await AppDataSource
        .getRepository(Team)
        .createQueryBuilder("team")
        .where("id = :id", { id })
        .getOne()
      return res.json(r);
    }
    const r = await AppDataSource
      .manager
      .getRepository(Team)
      .createQueryBuilder("team")
      .orderBy("team.name", "ASC")
      .getMany();
      return res.json(r);
  }

  public async getTermo(req: Request, res: Response): Promise<Response> {
    const {termo} = req.params;
    if (termo) {
      const r = await AppDataSource
      .getRepository(Team)
      .createQueryBuilder("team")
      .where("name ILIKE :name", {name: `%${termo}%`})
      .orderBy("team.name", "ASC")
      .getMany();
      return res.json(r);
    }
    const r = await AppDataSource
      .manager.find(Team);
    return res.json(r);
  }
}

export default new TeamController();