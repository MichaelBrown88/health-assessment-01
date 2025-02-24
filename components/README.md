# Component Library

This directory contains all React components used in the health assessment application. The components are organized following a feature-first architecture with shared components.

## Directory Structure

```
components/
├── core/               # Base UI components (buttons, inputs, etc.)
├── features/          # Feature-specific components
│   ├── assessment/    # Assessment-related components
│   ├── results/       # Results visualization components
│   ├── dashboard/     # Dashboard components
│   └── admin/         # Admin interface components
├── shared/            # Shared business components
│   ├── common/        # Common UI patterns (Section, LoadingState, etc.)
│   ├── analytics/     # Analytics components (MetricsCard, ProgressTracker)
│   ├── health/        # Health-related components
│   └── visualization/ # Data visualization components
├── auth/              # Authentication components
├── ai/                # AI-related components
└── layout/            # Layout components
```

## Component Categories

### Core Components

Base UI components that follow consistent design patterns. These are the building blocks for all other components.

### Feature Components

Components specific to a feature or page. These should:

- Be composed of core and shared components
- Contain feature-specific logic
- Not be reused outside their feature

### Shared Components

Reusable business components that:

- Implement common UI patterns
- Can be used across different features
- Are composable and configurable

### Layout Components

Components that define the application structure and layout.

## Best Practices

1. **Component Organization**

   - Keep related components together
   - Use index.ts files for clean exports
   - Co-locate component-specific types and utilities

2. **Component Design**

   - Make components composable
   - Use TypeScript interfaces for props
   - Implement proper error boundaries
   - Include loading states

3. **Code Style**

   - Use functional components
   - Implement proper prop types
   - Use consistent naming conventions
   - Include JSDoc comments for complex components

4. **Performance**
   - Use React.memo for expensive renders
   - Implement proper code splitting
   - Optimize re-renders with useMemo and useCallback

## Usage

Import components from their respective directories:

```typescript
// Core components
import { Button } from "@/components/core";

// Feature components
import { AssessmentForm } from "@/components/features/assessment";

// Shared components
import { Section, MetricsCard } from "@/components/shared";
```
