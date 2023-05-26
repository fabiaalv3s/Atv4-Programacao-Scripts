import { Router } from "express";
import TeamController from "../controllers/TeamController";

const routes = Router();

routes.get('/:termo', TeamController.getTermo);
routes.get('/', TeamController.get);
routes.post('/', TeamController.create);
routes.put('/', TeamController.update);
routes.delete('/', TeamController.delete);

export default routes;