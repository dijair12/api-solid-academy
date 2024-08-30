import { expect, describe, it, beforeEach } from "vitest";
import { CreateGymUseCase } from "./create-gym";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let inMemoryGymsRepository: InMemoryGymsRepository;
let createGymUseCase: CreateGymUseCase;

describe("CreateGym Use Case", () => {
  beforeEach(() => {
    inMemoryGymsRepository = new InMemoryGymsRepository();
    createGymUseCase = new CreateGymUseCase(inMemoryGymsRepository);
  });

  it("should be able to CreateGym", async () => {
    const { gym } = await createGymUseCase.execute({
      title: 'gym-1',
      phone: null,
      description: null,
      latitude: -23.625728,
      longitude: -46.7730432,
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
