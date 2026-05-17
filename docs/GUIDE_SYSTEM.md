# Interactive Guide System Documentation

## Overview

The Interactive Guide System is a comprehensive onboarding solution for the GEUWAT language learning application. It provides step-by-step guided tours across multiple pages using an avatar guide (kepala1.png), tooltips with instructional text, element highlighting with overlay, and automatic scrolling to target elements.

## Features

- ✅ **Multi-Page Guide Flow**: Seamlessly guides users through 32 steps across dashboard, skill selection, pronunciation features, alphabet practice, and phonetic symbols
- ✅ **Interactive & Auto Modes**: Supports both interactive mode (user must click target) and auto mode (Next button advances)
- ✅ **State Persistence**: Saves progress to localStorage with in-memory fallback
- ✅ **Pause & Resume**: Automatically pauses when user navigates away, offers to resume when returning
- ✅ **Error Handling**: Gracefully handles missing elements, failed navigation, and corrupted data
- ✅ **Performance Optimized**: Lazy loading, memoization, and conditional rendering
- ✅ **Responsive Design**: Adapts to desktop and mobile with bottom sheet on mobile
- ✅ **Accessibility**: Keyboard navigation, ARIA labels, and screen reader support

## Architecture

### Core Components

```
GuideProvider (Context)
├── GuideManager (Orchestrator)
│   ├── GuideOverlay (Visual Layer)
│   └── GuideTooltip (Instruction Panel)
├── GuideResumePrompt (Resume Dialog)
└── GuideCompletionMessage (Completion Dialog)
```

### Services

- **PersistenceService**: Manages localStorage with in-memory fallback
- **ScrollService**: Handles auto-scrolling to target elements
- **NavigationService**: Manages route transitions
- **ConfigService**: Loads and validates guide flow configuration

## Usage

### 1. Starting the Guide

The guide automatically starts for first-time users. To manually start:

```typescript
import { useGuide } from '@/contexts/GuideContext';

function MyComponent() {
  const { startGuide } = useGuide();
  
  return (
    <button onClick={startGuide}>
      Start Guide
    </button>
  );
}
```

### 2. Adding Data-Tour Attributes

To make an element targetable by the guide, add a `data-tour` attribute:

```tsx
<button data-tour="dashboard-initiate-training">
  INITIATE TRAINING
</button>
```

### 3. Configuring Guide Steps

Guide steps are configured in `config/guideFlowConfig.ts`:

```typescript
{
  id: 'dashboard-title',
  route: '/dashboard',
  targetSelector: '[data-tour="dashboard-title"]',
  tooltipText: 'Selamat datang di GEUWAT! Mari kita mulai tur singkat.',
  tooltipPosition: 'bottom',
  mode: 'auto', // or 'interactive'
  requiresNavigation: false,
  waitForElement: true,
  scrollBehavior: 'smooth',
}
```

### 4. Adding New Guide Steps

To add a new guide step:

1. Add `data-tour` attribute to the target element
2. Add step configuration to `GUIDE_FLOW` array in `guideFlowConfig.ts`
3. Update `TOTAL_GUIDE_STEPS` constant

Example:

```typescript
// 1. Add data-tour to element
<div data-tour="my-new-feature">
  My New Feature
</div>

// 2. Add to guideFlowConfig.ts
{
  id: 'my-new-feature',
  route: '/my-page',
  targetSelector: '[data-tour="my-new-feature"]',
  tooltipText: 'Ini adalah fitur baru yang keren!',
  tooltipPosition: 'bottom',
  mode: 'auto',
  requiresNavigation: false,
  waitForElement: true,
  scrollBehavior: 'smooth',
}

// 3. Update TOTAL_GUIDE_STEPS
export const TOTAL_GUIDE_STEPS = 33; // was 32
```

## Guide Step Configuration

### Step Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique identifier for the step |
| `route` | string | Next.js route where this step occurs |
| `targetSelector` | string | CSS selector for target element |
| `tooltipText` | string | Instructional text (Indonesian) |
| `tooltipPosition` | TooltipPosition | Position of tooltip relative to target |
| `mode` | StepMode | 'interactive' or 'auto' |
| `requiresNavigation` | boolean | Whether step navigates to another page |
| `navigationTarget` | string | Target route if requiresNavigation is true |
| `waitForElement` | boolean | Wait for element to appear in DOM |
| `scrollBehavior` | ScrollBehavior | 'smooth', 'instant', or 'none' |

### Step Modes

**Auto Mode** (`mode: 'auto'`):
- User clicks Next button to advance
- Target element is highlighted but not required to click
- Use for informational steps

**Interactive Mode** (`mode: 'interactive'`):
- User must click the target element to advance
- Element's normal action is executed
- Use for action steps (buttons, links)

## API Reference

### useGuide Hook

```typescript
const {
  // State
  isActive,
  currentStepIndex,
  totalSteps,
  currentStepId,
  isCompleted,
  isPaused,
  bonusOffered,
  bonusCompleted,
  
  // Navigation
  nextStep,
  prevStep,
  goToStep,
  
  // Control
  startGuide,
  pauseGuide,
  resumeGuide,
  closeGuide,
  resetGuide,
  completeGuide,
  offerBonus,
  completeBonus,
  
  // Query
  getCurrentStep,
  canGoNext,
  canGoPrev,
} = useGuide();
```

### PersistenceService

```typescript
// Save guide state
PersistenceService.saveState(state);

// Load guide state
const state = PersistenceService.loadState();

// Clear guide state
PersistenceService.clearState();

// Check if first-time user
const isFirstTime = PersistenceService.isFirstTimeUser();
```

### ScrollService

```typescript
// Scroll to element
await ScrollService.scrollToElement(element, 'smooth', 100);

// Check if element is in viewport
const isVisible = ScrollService.isElementInViewport(element);

// Wait for element to appear
const element = await ScrollService.waitForElement('[data-tour="my-element"]');
```

### NavigationService

```typescript
// Navigate to route
await NavigationService.navigateToRoute(router, '/my-route');

// Wait for route change
const success = await NavigationService.waitForRouteChange(router, '/my-route', 5000);
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Escape` | Close guide |
| `Arrow Left` | Previous step |
| `Arrow Right` | Next step |
| `Enter` / `Space` | Activate focused button |

## Accessibility

The guide system is fully accessible:

- ✅ Keyboard navigation support
- ✅ ARIA labels and roles
- ✅ Screen reader announcements
- ✅ Focus management
- ✅ High contrast support

## Error Handling

The guide system handles errors gracefully:

1. **Missing Target Element**: Skips to next step after showing error message
2. **Failed Navigation**: Retries with exponential backoff
3. **Corrupted Data**: Resets to initial state
4. **localStorage Unavailable**: Falls back to in-memory storage

## Performance

Performance optimizations:

- **Lazy Loading**: Guide components only load when needed
- **Memoization**: React.memo on GuideTooltip and GuideOverlay
- **Conditional Rendering**: Components only render when guide is active
- **Efficient Updates**: Memoized context values prevent unnecessary re-renders

## Troubleshooting

### Guide doesn't start automatically

Check if guide state exists in localStorage:
```javascript
localStorage.getItem('geuwat_guide_state')
```

Clear state to reset:
```javascript
localStorage.removeItem('geuwat_guide_state')
```

### Target element not found

1. Verify `data-tour` attribute exists on element
2. Check if element is rendered when step becomes active
3. Set `waitForElement: true` in step configuration

### Navigation not working

1. Check if `requiresNavigation` is set to `true`
2. Verify `navigationTarget` matches the route
3. Check browser console for navigation errors

### Guide pauses unexpectedly

This is expected behavior when user navigates manually. The guide will offer to resume when user returns.

## Testing

### Manual Testing Checklist

- [ ] Guide starts automatically for first-time users
- [ ] Guide doesn't start for returning users
- [ ] All 32 steps execute correctly
- [ ] Interactive mode requires target clicks
- [ ] Auto mode advances with Next button
- [ ] Navigation between pages works
- [ ] Pause and resume works
- [ ] Completion message shows
- [ ] Bonus offer shows
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive design works
- [ ] Error handling works (missing elements)

### Integration Testing

Integration tests can be written using Playwright:

```typescript
test('complete guide flow', async ({ page }) => {
  // Clear localStorage to simulate first-time user
  await page.evaluate(() => localStorage.clear());
  
  // Navigate to dashboard
  await page.goto('/dashboard');
  
  // Verify guide starts
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  
  // Click through all steps
  for (let i = 0; i < 32; i++) {
    await page.click('button:has-text("Next")');
    await page.waitForTimeout(500);
  }
  
  // Verify completion message
  await expect(page.locator('text=Selamat!')).toBeVisible();
});
```

## Best Practices

1. **Keep tooltipText concise**: Aim for 1-2 sentences
2. **Use interactive mode for actions**: Buttons, links, etc.
3. **Use auto mode for information**: Text, images, sections
4. **Test on mobile**: Ensure bottom sheet works properly
5. **Add waitForElement for dynamic content**: Elements that load after page render
6. **Use descriptive step IDs**: Makes debugging easier
7. **Group related steps**: Keep steps on same page together in config

## Future Enhancements

Potential improvements for future versions:

- [ ] Multiple guide flows (beginner, advanced, feature-specific)
- [ ] Guide analytics (completion rate, drop-off points)
- [ ] Video tutorials in tooltips
- [ ] Branching guide paths based on user choices
- [ ] Guide search/jump to specific step
- [ ] Multi-language support
- [ ] Custom themes for tooltips
- [ ] Guide progress indicator

## Support

For issues or questions about the guide system:

1. Check this documentation
2. Review the troubleshooting section
3. Check browser console for errors
4. Review guide configuration in `guideFlowConfig.ts`

## License

This guide system is part of the GEUWAT application and follows the same license.
