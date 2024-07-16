import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { Chat } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('chat')

export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post(':mitraId/:pelangganId')
  async createChat(
    @Param('mitraId') mitraId: string,
    @Param('pelangganId') pelangganId: string,
    @Body() chatData: { message: string;  attachment?: string },
  ): Promise<Chat> {
    return this.chatService.createChat(chatData, parseInt(mitraId), parseInt(pelangganId));
  }

  @Get(':id')
  async getChat(@Param('id') id: string): Promise<Chat | null> {
    return this.chatService.getChat(Number(id));
  }

  @Get()
  async getAllChats(): Promise<Chat[]> {
    return this.chatService.getAllChats();
  }

  @Put(':id')
  async updateChat(
    @Param('id') id: string,
    @Body() chatData: { message?: string; pelangganId?: number; mitraId?: number; isRead?: boolean; attachment?: string },
  ): Promise<Chat> {
    return this.chatService.updateChat(Number(id), chatData);
  }

  @Delete(':id')
  async deleteChat(@Param('id') id: string): Promise<Chat> {
    return this.chatService.deleteChat(Number(id));
  }
}
