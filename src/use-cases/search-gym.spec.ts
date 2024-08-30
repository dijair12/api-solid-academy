import { expect, describe, it, beforeEach } from "vitest";
import { SearchGymUseCase } from "./search-gym";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";

let gymsRepository: InMemoryGymsRepository;
let sut: SearchGymUseCase;

describe("Search Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new SearchGymUseCase(gymsRepository);
  });

  it("should be able to search gyms", async () => {
    await gymsRepository.create({
      title: "gym-1",
      phone: null,
      description: null,
      latitude: -23.625728,
      longitude: -46.7730432,
    });

    await gymsRepository.create({
      title: "gym-2",
      phone: null,
      description: null,
      latitude: -23.625728,
      longitude: -46.7730432,
    });

    const { gyms } = await sut.execute({ query: "gym-1", page: 1 });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "gym-1" })]);
  });

  it("should be able to fetch paginated gym search", async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: "gym-" + i,
        phone: null,
        description: null,
        latitude: -23.625728,
        longitude: -46.7730432,
      });
    }
    const { gyms } = await sut.execute({ query: "gym", page: 2 });

    expect(gyms).toHaveLength(2);
    expect(gyms).toEqual([
      expect.objectContaining({ title: "gym-21" }),
      expect.objectContaining({ title: "gym-22" }),
    ]);
  });
});
