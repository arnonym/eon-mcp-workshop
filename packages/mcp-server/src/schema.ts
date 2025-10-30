import { z } from 'zod';

export const EmployeeSchema = z.object({
  id: z.number().int(),
  first_name: z.string().max(100),
  last_name: z.string().max(100),
  team: z.string().max(100),
  line_manager: z.string().max(100),
  github_username: z.string().max(100).nullable(),
});

export type Employee = z.infer<typeof EmployeeSchema>;

export const TicketSchema = z.object({
  id: z.number().int(),
  title: z.string().max(255),
  description: z.string(),
  sprint: z.string().max(100),
  status: z.string().max(50),
  created_at: z.date(),
  updated_at: z.date(),
  assigned_to: z.number().int().nullable(),
});

export const EmployeeToolOutputSchema = z.object({
  employees: z.array(EmployeeSchema),
  count: z.number(),
});

export const TicketToolOutputSchema = z.object({
  tickets: z.array(TicketSchema),
  count: z.number(),
});
