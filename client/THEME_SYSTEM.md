# HRMS Theme System

This document describes the comprehensive theme system implemented in the HRMS application.

## Overview

The theme system provides dynamic theming capabilities with two main themes:
- **Super Admin Theme**: Professional green theme (#003c30, #60e59d)
- **Company Theme**: Purple theme (#521138, #843C6D)

## Theme Configuration

### Theme Colors

#### Super Admin Theme
- Primary: `#003c30` (Dark Green)
- Secondary: `#60e59d` (Light Green)
- Primary Hover: `#002a25`
- Secondary Hover: `#4dd88a`
- Primary Background: `#f0f9f6`
- Secondary Background: `#f8fdfa`

#### Company Theme
- Primary: `#521138` (Dark Purple)
- Secondary: `#843C6D` (Light Purple)
- Primary Hover: `#3d0d2a`
- Secondary Hover: `#6a2f57`
- Primary Background: `#fdf8fc`
- Secondary Background: `#faf5f9`

## CSS Custom Properties

The theme system uses CSS custom properties for dynamic theming:

```css
:root {
  --theme-primary: #003c30;
  --theme-secondary: #60e59d;
  --theme-primary-hover: #002a25;
  --theme-secondary-hover: #4dd88a;
  --theme-primary-light: #004d3d;
  --theme-secondary-light: #7aeea8;
  --theme-primary-bg: #f0f9f6;
  --theme-secondary-bg: #f8fdfa;
  --theme-gradient: linear-gradient(135deg, #003c30 0%, #60e59d 100%);
  --theme-gradient-hover: linear-gradient(135deg, #002a25 0%, #4dd88a 100%);
  --theme-border: #e0f2e9;
  --theme-shadow: 0 4px 6px -1px rgba(0, 60, 48, 0.1);
  --theme-shadow-lg: 0 10px 15px -3px rgba(0, 60, 48, 0.1);
}
```

## Utility Classes

The theme system provides utility classes for easy styling:

### Background Colors
- `.theme-primary` - Primary background color
- `.theme-secondary` - Secondary background color
- `.theme-bg-primary` - Primary background color (light)
- `.theme-bg-secondary` - Secondary background color (light)

### Text Colors
- `.theme-text-primary` - Primary text color
- `.theme-text-secondary` - Secondary text color

### Hover States
- `.theme-primary-hover` - Primary hover background
- `.theme-secondary-hover` - Secondary hover background

### Gradients
- `.theme-gradient` - Primary to secondary gradient
- `.theme-gradient-hover` - Hover gradient

### Borders and Shadows
- `.theme-border` - Theme border color
- `.theme-shadow` - Theme shadow
- `.theme-shadow-lg` - Large theme shadow

## Usage Examples

### Buttons
```tsx
// Primary button with theme colors
<Button variant="default">Primary Button</Button>

// Secondary button with theme colors
<Button variant="secondary">Secondary Button</Button>

// Gradient button
<Button variant="gradient">Gradient Button</Button>

// Outline button with theme hover
<Button variant="outline" className="theme-secondary-hover">
  Outline Button
</Button>
```

### Cards
```tsx
// Card with theme styling
<Card className="theme-bg-primary theme-border theme-shadow">
  <CardHeader>
    <CardTitle className="theme-text-primary">Card Title</CardTitle>
  </CardHeader>
  <CardContent>
    Card content with theme styling
  </CardContent>
</Card>
```

### Form Elements
```tsx
// Input with theme border
<Input className="theme-border" placeholder="Search..." />

// Dropdown with theme styling
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Select Option</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="theme-bg-secondary theme-border theme-shadow-lg">
    <DropdownMenuItem>Option 1</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Tabs
```tsx
<Tabs defaultValue="overview">
  <TabsList className="grid w-full grid-cols-3">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="analytics">Analytics</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">
    Content with theme styling
  </TabsContent>
</Tabs>
```

## Theme Hook

The `useTheme` hook provides easy access to theme functionality:

```tsx
import { useTheme } from '@/hooks/useTheme';

const MyComponent = () => {
  const { 
    currentTheme, 
    setTheme, 
    colors, 
    isSuperAdmin, 
    isCompany,
    getButtonClasses,
    getCardClasses 
  } = useTheme();

  return (
    <div>
      <p>Current theme: {currentTheme}</p>
      <Button 
        onClick={() => setTheme('company')}
        className={getButtonClasses('primary')}
      >
        Switch to Company Theme
      </Button>
    </div>
  );
};
```

## Theme Provider

The `ThemeProvider` automatically applies themes based on user role:

```tsx
// In App.tsx
<ThemeProvider>
  <BrowserRouter>
    <ProtectedApp />
  </BrowserRouter>
</ThemeProvider>
```

## Automatic Theme Detection

The theme system automatically detects and applies themes based on user roles:
- `super_admin` → Super Admin Theme
- Other roles → Company Theme

## Theme Persistence

Theme preferences are stored in localStorage and persist across sessions.

## Demo Page

Visit `/theme-demo` to see a comprehensive demonstration of the theme system with:
- Theme switcher
- Color palette display
- Component examples
- Theme information

## Implementation Files

- `client/src/lib/theme.ts` - Theme configuration and utilities
- `client/src/components/ThemeProvider.tsx` - Theme context provider
- `client/src/hooks/useTheme.ts` - Theme hook for components
- `client/src/index.css` - CSS custom properties and utility classes
- `client/src/components/ui/` - Updated UI components with theme support

## Best Practices

1. **Use Theme Classes**: Always use theme utility classes instead of hardcoded colors
2. **Consistent Styling**: Apply theme classes consistently across components
3. **Hover States**: Include appropriate hover states using theme classes
4. **Accessibility**: Ensure sufficient contrast ratios with theme colors
5. **Testing**: Test both themes to ensure proper functionality

## Adding New Theme Colors

To add new theme colors:

1. Update `client/src/lib/theme.ts` with new color definitions
2. Add CSS custom properties in `client/src/index.css`
3. Create utility classes for the new colors
4. Update components to use the new theme classes

## Migration Guide

To migrate existing components to use the theme system:

1. Replace hardcoded colors with theme utility classes
2. Update hover states to use theme hover classes
3. Replace gradient definitions with theme gradient classes
4. Test components with both themes
