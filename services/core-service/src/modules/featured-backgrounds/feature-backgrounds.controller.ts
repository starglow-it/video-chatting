import { Controller } from "@nestjs/common";
import { InjectConnection } from "@nestjs/mongoose";
import { Connection } from "mongoose";

@Controller('')
export class FeaturedBackgroundsController {
    constructor(@InjectConnection() connection: Connection
    ){}

    
}
