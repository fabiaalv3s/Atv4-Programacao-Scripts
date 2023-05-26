import { Router } from "express";
import MatchController from "../controllers/MatchController";

const routes = Router();

routes.post('/', MatchController.create);
routes.put('/', MatchController.edit);
routes.delete('/', MatchController.delete);
routes.get('/', MatchController.getAll);
routes.get('/:id', MatchController.getOne);
export default routes;