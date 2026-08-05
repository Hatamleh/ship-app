import { prisma } from '$lib/server/db'
import type { User, CreateUserInput } from '$lib/types'

/**
 * User Repository
 * Handles all database operations for User model
 */
export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    return user ? this.transform(user) : null
  }

  /**
   * Find user by email with password (for authentication)
   * Returns user with password hash for login verification
   */
  async findByEmailWithPassword(email: string): Promise<(User & { password: string }) | null> {
    const user = await prisma.user.findUnique({
      where: { email },
    })
    if (!user) return null

    return {
      ...this.transform(user),
      password: user.password,
    }
  }

  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where: { id },
    })
    return user ? this.transform(user) : null
  }

  /**
   * Create new user
   */
  async create(data: CreateUserInput & { password: string }): Promise<User> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        phone: data.phone,
        country: data.country,
        city: data.city,
        street: data.street,
        postalCode: data.postalCode,
      },
    })
    return this.transform(user)
  }

  /**
   * Update user personal information
   */
  async update(
    id: number,
    data: Partial<Omit<CreateUserInput, 'email' | 'password'>>
  ): Promise<User> {
    const user = await prisma.user.update({
      where: { id },
      data,
    })
    return this.transform(user)
  }

  /**
   * Delete user
   */
  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    })
  }

  /**
   * Transform Prisma User to Application User type
   * Removes sensitive fields and ensures consistent structure
   */
  private transform(user: any): User {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone,
      country: user.country,
      city: user.city,
      street: user.street,
      postalCode: user.postalCode,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}

// Export singleton instance
export const userRepository = new UserRepository()
