import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let checkInsRepository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;

describe("Get User Metrics Use Case", () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(checkInsRepository);
  });

  it("should be able to fetch check-in history", async () => {
    await checkInsRepository.create({
      gym_id: "gym_id_01",
      user_id: "user_id_01",
    });

    await checkInsRepository.create({
      gym_id: "gym_id_02",
      user_id: "user_id_01",
    });

    const { checkInsCount } = await sut.execute({ userId: "user_id_01" });

    expect(checkInsCount).toEqual(2);
  });
});
