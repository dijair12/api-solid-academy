import { compare } from "bcryptjs";
import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistError } from "./error/error-already-exists";

let inMemoryUsersRepository: InMemoryUsersRepository;
let registerUseCase: RegisterUseCase;

describe("Register Use Case", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    registerUseCase = new RegisterUseCase(inMemoryUsersRepository);
  });

  it("should be able to register", async () => {
    const { user } = await registerUseCase.execute({
      name: "John",
      email: "john@email.com",
      password: "2345",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const { user } = await registerUseCase.execute({
      name: "John",
      email: "john@email.com",
      password: "2345",
    });

    const isPasswordCorrectlyHashed = await compare("2345", user.password_hash);

    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    await registerUseCase.execute({
      name: "John",
      email: "john@email.com",
      password: "2345",
    });

    expect(async () => {
      await registerUseCase.execute({
        name: "John",
        email: "john@email.com",
        password: "2345",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistError);
  });
});
