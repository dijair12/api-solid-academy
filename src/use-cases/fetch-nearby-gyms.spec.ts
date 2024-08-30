import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearByGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository;
let sut: FetchNearByGymsUseCase;

describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository();
    sut = new FetchNearByGymsUseCase(gymsRepository);
  });

  it("should be able to fetch near by gyms", async () => {
    await gymsRepository.create({
      title: "Near Gym",
      phone: null,
      description: null,
      latitude: -23.625728,
      longitude: -46.7730432,
    });

    await gymsRepository.create({
      title: "Far Gym",
      phone: null,
      description: null,
      latitude: -23.5582918,
      longitude: -46.6594973,
    });

    const { gyms } = await sut.execute({
      userLatitude: -23.625728,
      userLongitude: -46.7730432,
    });

    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ title: "Near Gym" })]);
  });
});
