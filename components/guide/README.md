# Guide Components

This directory contains all components for the Interactive Guide System.

## Components

### GuideManager.tsx
Main orchestrator component that manages guide state, navigation, and rendering.

**Responsibilities:**
- Finds target elements using CSS selectors
- Handles step transitions
- Coordinates scrolling and navigation
- Manages interactive mode clicks
- Handles errors gracefully

### GuideOverlay.tsx
Renders semi-transparent overlay that highlights target elements.

**Features:**
- Creates cutout effect around target
- Dims non-target areas
- Blocks clicks on non-target elements
- Updates on scroll/resize

### GuideTooltip.tsx
Displays instructional content with avatar and navigation controls.

**Features:**
- Shows avatar image (kepala1.png)
- Displays instructional text
- Prev/Next/Close buttons
- Keyboard shortcuts support
- Responsive design (bottom sheet on mobile)

### GuideResumePrompt.tsx
Dialog that prompts user to resume paused guide.

**Features:**
- Shows when guide is paused
- Resume or Dismiss options
- Modal overlay

### GuideCompletionMessage.tsx
Congratulations dialog shown when guide completes.

**Features:**
- Completion message
- Bonus offer for vocabulary guide
- Accept/Decline options

## Usage

These components are automatically rendered by GuideProvider when the guide is active. You don't need to import them directly in your pages.

To use the guide system in your page:

```tsx
import { useGuide } from '@/contexts/GuideContext';

function MyPage() {
  const { startGuide } = useGuide();
  
  return (
    <div>
      <button 
        data-tour="my-button"
        onClick={startGuide}
      >
        Start Guide
      </button>
    </div>
  );
}
```

## Styling

Components use Tailwind CSS for styling. Key classes:

- `z-[9998]` - Overlay z-index
- `z-[10001]` - Tooltip z-index
- `z-[10002]` - Loading overlay z-index
- `z-[10003]` - Error message z-index

## Performance

All components are optimized:
- GuideManager is lazy loaded
- GuideTooltip and GuideOverlay use React.memo
- Conditional rendering based on guide state

## Accessibility

All components follow accessibility best practices:
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support

## See Also

- [Full Documentation](../../docs/GUIDE_SYSTEM.md)
- [Guide Configuration](../../config/guideFlowConfig.ts)
- [Guide Context](../../contexts/GuideContext.tsx)
