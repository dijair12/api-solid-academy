import { makeSearchGymUseCase } from "@/use-cases/factories/make-search-gym-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function search(request: FastifyRequest, reply: FastifyReply) {
  const searchGymsQuerySchema = z.object({
    q: z.string(),
    page: z.coerce.number().default(1),
  });

  const { q, page } = searchGymsQuerySchema.parse(request.query);

  const searchGymUseCase = makeSearchGymUseCase();
  const { gyms } = await searchGymUseCase.execute({
    page,
    query: q,
  });

  return reply.status(200).send({ gyms });
}
