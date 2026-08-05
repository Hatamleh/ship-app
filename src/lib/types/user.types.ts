/**
 * User Type Definitions
 * Centralized user-related types for the application
 */

/**
 * User entity without password
 * Represents a user in the system with all public fields
 */
export interface User {
  id: number
  email: string
  fullName: string
  phone: string
  country: string
  city: string
  street: string
  postalCode: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Input type for creating a new user
 * Includes password for registration
 */
export interface CreateUserInput {
  email: string
  password: string
  fullName: string
  phone: string
  country: string
  city: string
  street: string
  postalCode: string
}
