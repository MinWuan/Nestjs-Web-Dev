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
    // const pipeline = [
    //   // 1. Tìm Session theo _id
    //   {
    //     $match: {
    //       _id: new ObjectId(sessionId),
    //     },
    //   },
  
    //   // 2. Join với collection 'users'
    //   {
    //     $lookup: {
    //       from: "users",           // Tên collection User trong DB
    //       localField: "id_user",   // Field khóa ngoại trong Session
    //       foreignField: "_id",     // Khóa chính của User
    //       as: "user",
    //     },
    //   },
  
    //   // 3. Giải nén mảng 'user' thành object
    //   {
    //     $unwind: {
    //       path: "$user",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
  
    //   // 4. Join từ User sang collection 'roles'
    //   {
    //     $lookup: {
    //       from: "roles",              // Tên collection Role trong DB
    //       localField: "user.id_role", // Lấy id_role từ object user vừa giải nén ở bước 3
    //       foreignField: "_id",        // Khóa chính của Role
    //       as: "user.role",            // Đẩy dữ liệu role vào thẳng trong object user
    //     },
    //   },
  
    //   // 5. Giải nén mảng 'role' bên trong user
    //   {
    //     $unwind: {
    //       path: "$user.role",
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    // ];
    const pipeline = [
      // 1. Match theo _id của Session
      {
        $match: {
          _id: new ObjectId(sessionId),
        },
      },
  
      // 2. Chuyển đổi id_user sang ObjectId (an toàn cho cả String lẫn ObjectId)
      {
        $addFields: {
          id_user_obj: { $toObjectId: "$id_user" },
        },
      },
  
      // 3. Lookup với collection 'users' dùng field vừa convert
      {
        $lookup: {
          from: "users",
          localField: "id_user_obj",
          foreignField: "_id",
          as: "user",
        },
      },
  
      // 4. Unwind user
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
  
      // 5. Chuyển đổi id_role bên trong user sang ObjectId
      {
        $addFields: {
          "user.id_role_obj": {
            $cond: {
              if: { $gt: ["$user.id_role", null] },
              then: { $toObjectId: "$user.id_role" },
              else: null,
            },
          },
        },
      },
  
      // 6. Lookup với collection 'roles'
      {
        $lookup: {
          from: "roles",
          localField: "user.id_role_obj",
          foreignField: "_id",
          as: "user.role",
        },
      },
  
      // 7. Unwind role
      {
        $unwind: {
          path: "$user.role",
          preserveNullAndEmptyArrays: true,
        },
      },
  
      // 8. Dọn dẹp các field phụ tạm thời (optional)
      {
        $project: {
          id_user_obj: 0,
          "user.id_role_obj": 0,
        },
      },
    ];
    const result = await this.repo.aggregate(pipeline).toArray();
    return result.length > 0 ? result[0] : null;
  }
}
