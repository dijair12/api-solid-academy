import { expect, describe, it, beforeEach, vi, afterEach } from "vitest";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Prisma } from "@prisma/client";
import { MaxNumberOfCheckInsError } from "./error/max-number-of-check-ins-error";
import { MaxDistanceError } from "./error/max-distance-error";

let checkInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("CheckIn Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(checkInsRepository, gymsRepository);

    await gymsRepository.create({
      id: "gym_id-1",
      title: "gym-fitness-01",
      description: "gym-fitness-01",
      latitude: new Prisma.Decimal(-23.625728),
      longitude: new Prisma.Decimal(-46.7730432),
      phone: "",
    });

    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should be able to check in", async () => {
    const { checkIn } = await sut.execute({
      gymId: "gym_id-1",
      userId: "user_id-1",
      userLatitude: -23.625728,
      userLongitude: -46.7730432,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in twice in the same day", async () => {
    vi.setSystemTime(new Date(2024, 3, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym_id-1",
      userId: "user_id-1",
      userLatitude: -23.625728,
      userLongitude: -46.7730432,
    });

    expect(async () => {
      await sut.execute({
        gymId: "gym_id-1",
        userId: "user_id-1",
        userLatitude: -23.625728,
        userLongitude: -46.7730432,
      });
    }).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date(2024, 3, 20, 8, 0, 0));

    await sut.execute({
      gymId: "gym_id-1",
      userId: "user_id-1",
      userLatitude: -23.625728,
      userLongitude: -46.7730432,
    });

    vi.setSystemTime(new Date(2024, 3, 21, 8, 0, 0));
    const { checkIn } = await sut.execute({
      gymId: "gym_id-1",
      userId: "user_id-1",
      userLatitude: -23.625728,
      userLongitude: -46.7730432,
    });

    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    await gymsRepository.create({
      id: "gym_id-02",
      title: "gym-fitness-02",
      description: "gym-fitness-02",
      latitude: new Prisma.Decimal(-23.625728),
      longitude: new Prisma.Decimal(-46.7730432),
      phone: "",
    });

    expect(async () => {
      await sut.execute({
        gymId: "gym_id-02",
        userId: "user_id-1",
        userLatitude: -23.6144942,
        userLongitude: -46.7753139,
      });
    }).rejects.toBeInstanceOf(MaxDistanceError);
  });
});
