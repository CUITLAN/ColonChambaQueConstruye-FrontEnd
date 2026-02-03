import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El correo electrónico es requerido' })
    .email({ message: 'Debe ser un correo electrónico válido' })
    .max(244, { message: 'El correo no puede exceder los 244 caracteres' })
    .refine((email) => email.trim() === email, {
      message: 'El correo no debe contener espacios al inicio o final',
    }),

  password: z
    .string()
    .min(1, { message: 'Ingrese la contraseña' })
    .max(50, { message: 'La contraseña no puede exceder los 50 caracteres' }),
});

export type LoginFormType = z.infer<typeof loginSchema>;


export const loginResponseSchema = z.object({
 
  data: z.object({
    token: z.string(),
    id: z.string(),
    email: z.string().email(),
    status: z.string(),
  }),
});