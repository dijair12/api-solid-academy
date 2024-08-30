import { Gym } from "@prisma/client";
import { GymsRepository } from "@/repositories/gym-repository";

interface CreateGymUseCaseRequest {
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  phone: string | null;
}

interface CreateGymUseCaseResponse {
  gym: Gym;
}

export class CreateGymUseCase {
  constructor(private gymsRepository: GymsRepository) {}

  async execute({
    title,
    description,
    latitude,
    longitude,
    phone,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    const gym = await this.gymsRepository.create({
      title,
      description,
      latitude,
      longitude,
      phone,
    });
    return { gym };
  }
}
