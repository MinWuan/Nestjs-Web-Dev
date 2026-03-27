import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { DOMAIN } from '@/common/constants/common';
import { ObjectId } from 'mongodb';

import { User } from '../../entity';

@Injectable()
export class UserRepositoryFacade {
  constructor(
    @InjectRepository(User, DOMAIN.main.name)
    private repo: MongoRepository<User>,
  ) {}
  //Tìm user bằng email có tồn tại hay không
  async findByEmail(email: string): Promise<User | null> {
    const results = await this.repo
      .aggregate([
        // Bước 1: Tìm chính xác User theo email
        {
          $match: {
            email: email,
          },
        },
        // Bước 2: Join với collection Role để lấy dữ liệu
        {
          $lookup: {
            from: 'roles', // Tên collection của Role trong MongoDB
            localField: 'id_role', // Tên field trong bảng User đang lưu ID của Role
            foreignField: '_id', // Field khóa chính trong bảng Role
            as: 'role', // Tên field mới chứa kết quả join trả về (mặc định là 1 mảng)
          },
        },
        // Bước 3: Đưa mảng roleData thành 1 object duy nhất (vì 1 User thường chỉ có 1 Role)
        {
          $unwind: {
            path: '$role',
            preserveNullAndEmptyArrays: true, // Giữ lại kết quả User ngay cả khi id_role bị null hoặc không khớp
          },
        },
      ])
      .toArray();

    return results.length > 0 ? results[0] : null;
  }

  //Tìm user bằng id
  async findById(id: string): Promise<User | null> {
    const results = await this.repo.findOne({ 
      where: {
        _id: new ObjectId(id),
      },
     });
    return results;
  }
}
