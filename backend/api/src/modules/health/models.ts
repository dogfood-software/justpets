import { z } from "zod";

export const dependencySchema = z.discriminatedUnion("status", [
  z.object({
    status: z.literal("healthy"),
    latency: z.number().describe("The latency of the dependency in milliseconds"),
  }).meta({ title: "Healthy" }),
  z.object({
    status: z.literal("unhealthy"),
    latency: z.number().describe("The latency of the dependency in milliseconds"),
    error: z.any().optional().describe("Current error when unhealthy"),
  }).meta({ title: "Unhealthy" }),
]);

export type DependencyResponse = z.infer<typeof dependencySchema>;
