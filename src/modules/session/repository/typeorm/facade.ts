import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DOMAIN } from '@/common/constants/common';
import { ObjectId } from 'mongodb';

import { Session,SessionInput } from '../../entity';

@Injectable()
export class SessionRepositoryFacade {
  constructor(
    @InjectRepository(Session, DOMAIN.main.name)
    private repo: MongoRepository<Session>,
  ) {}

  async createSession(session: SessionInput): Promise<Session> {
    const newSession = this.repo.create(session);
    return this.repo.save(newSession);
  }

  async getSessionWithUserAndRole(sessionId: string): Promise<Session | null> {
    const pipeline = [
      // 1. Tìm Session theo _id
      {
        $match: {
          _id: new ObjectId(sessionId),
        },
      },
  
      // 2. Join với collection 'users'
      {
        $lookup: {
          from: "users",           // Tên collection User trong DB
          localField: "id_user",   // Field khóa ngoại trong Session
          foreignField: "_id",     // Khóa chính của User
          as: "user",
        },
      },
  
      // 3. Giải nén mảng 'user' thành object
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
  
      // 4. Join từ User sang collection 'roles'
      {
        $lookup: {
          from: "roles",              // Tên collection Role trong DB
          localField: "user.id_role", // Lấy id_role từ object user vừa giải nén ở bước 3
          foreignField: "_id",        // Khóa chính của Role
          as: "user.role",            // Đẩy dữ liệu role vào thẳng trong object user
        },
      },
  
      // 5. Giải nén mảng 'role' bên trong user
      {
        $unwind: {
          path: "$user.role",
          preserveNullAndEmptyArrays: true,
        },
      },
    ];

    const result = await this.repo.aggregate(pipeline).toArray();
    return result.length > 0 ? result[0] : null;
  }
}
