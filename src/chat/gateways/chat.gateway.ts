import { Logger, UseGuards } from '@nestjs/common';
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../../user/services/user.service';
import { MessageDto } from '../dtos/message.dtos';
import { WsJwtGuard } from '../guards/ws-jwt.guard';
import { Message } from '../schemas/message.schema';
import { ChatService } from '../services/chat.service';

@WebSocketGateway({
  cors: {
    origin: '*',//process.env.FRONT_END_URL || 'http://localhost:3000',
    credentials: true
  },
  transports: ['websocket', 'polling']
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService, private readonly userService: UserService){}

  async handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    await this.updateConnection(client, true)
  }

  @UseGuards(WsJwtGuard)
  async handleDisconnect(client: Socket) {
    this.logger.log(`Client Disconnected ${client.id}`)
    await this.updateConnection(client, false)
  }

  @UseGuards(WsJwtGuard)
  async updateConnection(client: Socket, isOnline: boolean) {
    const user = client.data.user;
    if (!user) return
    await this.userService.update(user._id, { isOnline })
    this.server.emit('userStatus', { userId: user._id, isOnline})
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('joinRoom')
  handleJoinRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string){
    this.logger.log(`Room is ${room}`)
    client.join(room);
    return { event: 'joinRoom', data: { room }};
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('leaveRoom')
  handleLeavingRoom(@ConnectedSocket() client: Socket, @MessageBody() room: string) {
    client.leave(room);
    return { event: 'leaveRoom', data: { room }}
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('sendMessage')
  async sendMessage(@ConnectedSocket() client: Socket, @MessageBody() messageDto: MessageDto){
    try {
    const userId = client.data.user._id;
    const message = await this.chatService.createMessage({...messageDto, sender: userId});
    const populateMessage = await message.populate('sender', 'email username');
    const { _id, content, sender, room, createdAt } = populateMessage;

    this.server.to(messageDto.room || 'public').emit('newMessage', {
      _id, content, sender, room, createdAt
    })

    this.logger.log(`Message Sent to ${room} with id: ${_id}`);

    return populateMessage;
   } catch(error) {
    this.logger.error(`Error sending message`,error)
   }

  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('getRoomMembers')
  async handleGetRoomMembers(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: string,
  ) {
    const sockets = await this.server.in(room).fetchSockets();
    client.emit('roomMembers', {
      room,
      members: Array.from(sockets)
    });
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('privateMessage')
  async handlePrivateMessage(client: Socket, payload: MessageDto){
    const user = client.data.user;

    try {
      
      const message = await this.chatService.createMessage(
        { ...payload,
          sender: user._id,
        }
      )

      const populateMessage = await message.populate(['sender', 'recipient']);
      
      const recipientSocket = this.server.sockets.sockets.get(Array.from(this.server.sockets.sockets.values()).find((socket: Socket) => socket.data.user._id.toString() === payload.recipient)?.id)
      if (recipientSocket) {
        recipientSocket.emit('privateMessage', {...message})
      }
      client.emit('messageDelivered', {...populateMessage})
    } catch (error) {
      console.error('Error is', error)
      client.emit('messageDeliveryError', { error: 'Failed to send message'});
    }
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('messageRead')
  async handleMessageRead(client: Socket, message: Partial<Message>){
    try {
      const { user }  = client.data;
      const updatedMessage = await this.chatService.markMessageAsRead({ _id: message._id, recipient: user._id})
      
      if(updatedMessage) {
        const senderSocket = this.server.sockets.sockets.get(
          Array.from(this.server.sockets.sockets.values())
          .find((socket: Socket) => socket.data.user._id.toString() === message.sender._id.toString())?.id
        )

        if (senderSocket) {
          senderSocket.emit('messageRead', {
            ...message,
            readAt: updatedMessage.readAt
          })
        }
      }
    } catch (error) {
      
    }
  }
}
