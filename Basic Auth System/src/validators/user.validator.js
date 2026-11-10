import { z } from 'zod'

// Register schema — all fields required, trimmed before validation
export const registerSchema = z.object({
    username: z.string().trim().min(3, "Username must be at least 3 characters"),
    fullName: z.string().trim().min(3, "Full name must be at least 3 characters"),
    email: z.string().trim().email("Invalid email address"),
    password: z.string().trim().min(8, "Password must be at least 8 characters").max(16, "Password must be at most 16 characters")
})

// Login schema — password required, at least one of username or email required
export const loginSchema = z.object({
    username: z.string().trim().min(1).optional(),
    email: z.string().trim().email("Invalid email address").optional(),
    password: z.string().trim().min(1, "Password is required")
}).refine(data => data.username || data.email, {
    message: "Username or email is required",
    path: ["username"]
})