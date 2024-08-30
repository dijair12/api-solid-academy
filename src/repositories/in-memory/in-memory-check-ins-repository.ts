import { CheckIn, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";
import { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";

export class InMemoryCheckInsRepository implements CheckInsRepository {
  checkIn: CheckIn[] = [];

  async save(checkIn: CheckIn): Promise<CheckIn> {
    const indexCheckIn = this.checkIn.findIndex(
      (item) => item.id === checkIn.id
    );

    if (indexCheckIn >= 0) {
      this.checkIn[indexCheckIn] = checkIn;
    }
    return checkIn;
  }

  async findByUserIdOnDate(
    userId: string,
    date: Date
  ): Promise<CheckIn | null> {
    const startOfTheDay = dayjs(date).startOf("date");
    const endOfTheDay = dayjs(date).endOf("date");

    const checkInOnSameDate = this.checkIn.find((item) => {
      const checkInDate = dayjs(item.created_at);
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);
      return item.user_id === userId && isOnSameDate;
    });
    if (!checkInOnSameDate) {
      return null;
    }
    return checkInOnSameDate;
  }

  async findById(id: string): Promise<CheckIn | null> {
    const checkIn = this.checkIn.find((item) => item.id === id);

    if (!checkIn) {
      return null;
    }
    return checkIn;
  }

  async countByUserId(userId: string): Promise<number> {
    return this.checkIn.filter((item) => item.user_id === userId).length;
  }

  async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
    return this.checkIn
      .filter((item) => item.user_id === userId)
      .slice((page - 1) * 20, page * 20);
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data?.user_id,
      gym_id: data?.gym_id,
      validated_at: data?.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    };
    this.checkIn.push(checkIn);
    return checkIn;
  }
}
