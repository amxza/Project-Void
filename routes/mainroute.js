import { Router } from "express";
import passport from "passport";
import mainControl from '../controllers/mainControl';
const mainRoute = Router();

mainRoute.get("/", mainControl.mainPage);


export {mainRoute};