# AGENTS.md - Development Guidelines for AI Agents

This file contains essential information for AI agents working on this Next.js frontend project for the UAQ Job Board System.

## Project Overview

**Type**: Next.js 15 frontend with TypeScript and App Router  
**Purpose**: Job board system connecting university community with companies  
**Architecture**: Modern React patterns with Zustand state management

## Build Commands

### Core Commands

```bash
npm run dev          # Development server with Turbopack
npm run build        # Production build
npm run start        # Production server
npm run lint         # ESLint checking
npm run format       # Prettier formatting
```

### Testing

- **No test framework currently configured**
- Use visual testing in `src/app/testing/` for component verification
- Manual testing recommended before commits

## Code Style Guidelines

### File Naming Conventions

- **Custom components**: PascalCase (`MyComponent.tsx`)
- **Shadcn/UI components**: lowercase (`button.tsx`)
- **Interfaces/Types**: PascalCase (`.tsx` extension)
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx`
- **Stores**: camelCase with `Store` suffix (`authStore.tsx`)

### Import Organization

```typescript
// 1. React/Next.js imports
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// 2. Third-party libraries
import { z } from 'zod';
import { cva } from 'class-variance-authority';

// 3. UI components (lowercase shadcn)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 4. Custom components (PascalCase)
import { Alert } from '@/components/common/Alert';
import { SearchBar } from '@/components/common/SearchBar';

// 5. Internal utilities/services
import { cn } from '@/lib/utils';
import { apiService } from '@/services/apiService';

// 6. Types/Interfaces
import type { User } from '@/interfaces/user';
import type { LoginFormType } from '@/validations/loginSchema';
```

### TypeScript Guidelines

- **Strict mode enabled** - all types must be properly defined
- Use `interface` for object shapes, `type` for unions/primitives
- Export types from interfaces files: `export type User = { ... }`
- Use `z.infer<>` for form types from Zod schemas
- Prefer explicit return types for functions

### Component Patterns

#### Custom Components (PascalCase)

```typescript
interface ComponentProps {
  // Props interface with JSDoc comments
  title: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function MyComponent({
  title,
  isVisible,
  onClose
}: ComponentProps) {
  // Component logic
  return <div>{title}</div>;
}
```

#### Shadcn/UI Modifications

- Add comment at top when modifying: `//* New styles added`
- Keep original lowercase naming
- Extend variants using `cva` when adding new styles

### State Management (Zustand)

```typescript
interface AuthState {
  token: string | null;
  id: string | null;
  login: (data: LoginData) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Store implementation
}));
```

### Form Validation (Zod)

```typescript
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'El correo electrónico es requerido' })
    .email({ message: 'Debe ser un correo electrónico válido' }),
});

export type LoginFormType = z.infer<typeof loginSchema>;
```

## Language Conventions

### Code (Variables, Functions, Files)

- **Language**: English
- Examples: `const userName = '...'`, `function handleSubmit()`

### User-Facing Text

- **Language**: Spanish
- Examples: error messages, labels, placeholders
- Example: `message: 'El correo electrónico es requerido'`

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (presentation)/     # Route groups
│   ├── applicant/         # User role routes
│   ├── employer/          # Company routes
│   ├── linker/            # Admin routes
│   ├── store/             # Zustand stores
│   └── testing/           # Component testing
├── components/
│   ├── common/            # Generic components (PascalCase)
│   ├── ui/               # Shadcn/UI only (lowercase)
│   └── [domain]/         # Feature components
├── interfaces/           # TypeScript definitions
├── constants/            # Static constants
├── lib/                 # Utilities
├── services/            # API layer
└── validations/         # Zod schemas
```

## Styling Guidelines

### Tailwind CSS

- Use utility classes primarily
- Custom colors: `uaq-brand`, `uaq-danger`, `uaq-warning`, etc.
- Component variants via `class-variance-authority`
- Responsive design with mobile-first approach

### CSS Organization

```typescript
// Use cn() utility for conditional classes
className={cn(
  "base-classes",
  isActive && "active-classes",
  className
)}
```

## Error Handling

### API Errors

- Use try-catch blocks for async operations
- Display user-friendly error messages in Spanish
- Log technical errors for debugging

### Form Validation

- Client-side validation with Zod
- Server-side validation responses
- Clear error messages below fields

## Git Workflow

### Branch Naming

- Features: `feature/description`
- Fixes: `fix/description`
- Chores: `chore/description`

### Commit Messages

- Format: `[type] brief description`
- Types: feat, fix, chore, docs, refactor, test, style

### Pre-commit Checklist

1. Run `npm run lint` - fix any errors
2. Run `npm run format` - ensure consistent formatting
3. Test changes manually
4. Verify no console errors

## Development Notes

### Environment

- Node.js ≥ 22.12.0
- npm ≥ 11.3.0
- Next.js 15 with Turbopack

### Key Dependencies

- **UI**: Shadcn/UI, Radix UI, NextUI (phasing out)
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React, Solar Icons

### API Integration

- Base URL configured via environment rewrites
- Cookie-based authentication (`admin-auth` cookie)
- Protected routes via middleware

### Performance

- Image optimization via Next.js Image component
- Code splitting with dynamic imports
- Bundle size monitoring recommended

## Common Patterns

### Fetching Data

```typescript
// Use custom service functions
const { data, error } = await apiService.getUser(id);
if (error) {
  // Handle error
}
```

### Loading States

- Use boolean flags for loading states
- Show skeleton components during data fetch
- Handle empty states gracefully

### Accessibility

- Use semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- Screen reader compatibility

## Testing Strategy

### Manual Testing

- Use `src/app/testing/` for visual component testing
- Test responsive design at different breakpoints
- Verify form validation behavior
- Check error handling scenarios

### Browser Testing

- Test in modern browsers (Chrome, Firefox, Safari, Edge)
- Verify mobile responsiveness
- Check touch interactions on mobile devices

## Security Considerations

- Never expose sensitive data in client-side code
- Validate all inputs on both client and server
- Use HTTPS in production
- Implement proper authentication checks
- Sanitize user inputs before display

## When in Doubt

1. **Check existing patterns** - Look at similar components/files
2. **Follow README conventions** - Refer to project README for specific guidelines
3. **Maintain consistency** - When adding new features, match existing code style
4. **Ask for clarification** - If unsure about requirements, seek guidance

---

**Last Updated**: 2026-02-05  
**Project**: Sistema General de Bolsa de Trabajo UAQ (Frontend)  
**Framework**: Next.js 15 + TypeScript
