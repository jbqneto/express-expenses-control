import { Request, Response, Router } from "express";
import { requireAuth } from "../middlewares/middleware";

export type HttpType = "GET" | "POST" | "PUT" | "DELETE";

export class DefaultRouteBuilder {
    
    private router: Router;

    constructor(private rootPath: string, mustAuth: boolean = false) {
        this.router = Router();
        if (mustAuth) {
            this.router.use(requireAuth);
        }
        
    }

    public addGet(path: string, handler: (req: Request, res: Response) => void): DefaultRouteBuilder {
        return this.addRoute("GET", path, handler);
    }

    public addPost(path: string, handler: (req: Request, res: Response) => void): DefaultRouteBuilder {
        return this.addRoute("POST", path, handler);
    }

    public addPut(path: string, handler: (req: Request, res: Response) => void): DefaultRouteBuilder {
        return this.addRoute("PUT", path, handler);
    }

    public addDelete(path: string, handler: (req: Request, res: Response) => void): DefaultRouteBuilder {
        return this.addRoute("DELETE", path, handler);
    }

    public addRoute(type: HttpType,path: string, handler: (req: Request, res: Response) => void): DefaultRouteBuilder {
        switch (type) {
            case "GET":
            this.router.get(path, handler);
            break;
            case "POST":
            this.router.post(path, handler);
            break;
            case "PUT":
            this.router.put(path, handler);
            break;
            case "DELETE":
            this.router.delete(path, handler);
            break;
            default:
            throw new Error(`Unsupported HTTP method: ${type}`);
        }
        
        return this;
    }

    public build(): Router {
        return this.router;
    }

}