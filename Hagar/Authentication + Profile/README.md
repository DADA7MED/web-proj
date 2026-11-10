# Authentication & Profile Management — Hagar

## Overview
This module implements the complete **Customer Authentication & User Profile Management** system for the Laptop Store web application.

## Implemented Features
1. **Authentication Portal (`auth.html`)**:
   - Secure tabbed Sign In & Sign Up interfaces
   - Field validations (Email format, password length, required full name)
   - One-click quick demo buttons for testing:
     - Standard Customer (`demo@apex.com`)
     - Store Administrator (`admin@apex.com`)
   - Role & Account types selection (Pro Creator, Student, Enterprise IT, Gamer)

2. **User Profile View**:
   - Personalized avatar, member role badges, and registration date
   - Edit personal phone number and delivery addresses
   - Placed orders counter & saved wishlist items counter
   - Direct shortcuts to user's order history and saved items
   - Secure session sign-out

3. **Auth Store (`authStore.js`)**:
   - `getCurrentUser()`, `isAuthenticated()`
   - `login(email, password)`
   - `register(userData)`
   - `updateProfile(data)`
   - `logout()`
   - Event-driven reactive updates across all navigation bars (`auth-updated` event)
