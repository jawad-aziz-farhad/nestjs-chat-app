import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/common/guards/auth-guard";
import { ChatService } from "../services/chat.service";

@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService){}

   @UseGuards(AuthGuard)
   @Get()
   getMessage(@Req() req, @Query('recipient') recipient: string,@Query('sender') sender: string){
      console.log('Getting Messages', req.user._id)  
      return this.chatService.getMessages(req.user._id, recipient)
   }
}