# GitHub Copilot Instructions

## Critical Rules

1. **NEVER use emojis in the UI code.** Use proper icon components (lucide-react) instead of emoji characters in the interface.

2. **Always use TypeScript** - No implicit any types

3. **Follow the existing code style** - Match indentation, naming conventions, and patterns

4. **Multi-language support** - Always provide both English and Arabic text for UI elements using the `isArabic` pattern

5. **Use existing components** - Leverage components from `@/components/ui/` instead of creating new ones

6. **Keep code DRY** - Extract reusable logic and components

7. **Responsive design** - Always consider mobile, tablet, and desktop viewports

8. **Accessibility** - Use semantic HTML and proper ARIA labels

9. **Performance** - Optimize re-renders with proper React patterns

10. **Dark mode support** - All UI elements must work in both light and dark themes
