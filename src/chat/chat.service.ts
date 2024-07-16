import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { Prisma, Chat } from '@prisma/client';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async createChat(data: any, pelangganId: number, mitraId: number): Promise<Chat> {
    return this.prisma.chat.create({ data: {
        pelangganId: pelangganId,
        mitraId: mitraId,
        ...data
    } });
  }

  async getChat(id: number): Promise<Chat | null> {
    return this.prisma.chat.findUnique({ where: { id } });
  }

  async getAllChats(): Promise<Chat[]> {
    return this.prisma.chat.findMany();
  }

  async updateChat(id: number, data: Prisma.ChatUpdateInput): Promise<Chat> {
    return this.prisma.chat.update({ where: { id }, data });
  }

  async deleteChat(id: number): Promise<Chat> {
    return this.prisma.chat.delete({ where: { id } });
  }
}
