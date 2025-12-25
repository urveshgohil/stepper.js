# Release v2.2.12

## Summary

Re-init safety fix for tab wrappers. No API changes. Behavior remains the same as `2.2.10` (no doneProcess; previous steps are marked done only when indicatorVisible is true).

## Fixed

1. Duplicate tabs wrapper on re-initialization: .st-tabs-scroll/.st-tabs-wrapper are now inserted only if they don’t already exist. This prevents duplicated scrollers/DOM inflation when stepper() is called multiple times on the same container.
2. If absent, it inserts TabsWrapper(); then queries .st-tabs-wrapper from the container.
3. All other logic (indicator handling, submit defensiveness, theme class cleanup, clearing and reapplying step-done on init) remains as in `2.2.10`.

## Migration

Drop-in upgrade from `2.2.10`.

Multiple window resize listeners are still attached inside switchTabAndPane, which can accumulate after many step changes. Prefer a single per-container listener or ResizeObserver.
Indicator markup still has mismatched closing tags and uses a non-standard ARIA role="indicator". Consider switching to role="status" and fixing the template structure. If you want, I can provide a compact patch that corrects both while preserving behavior.





# Release v2.2.10

## Summary

Simplifies “done” state logic and minor hygiene. No API additions. Note: this version removes the doneProcess option and now marks previous steps as done only when the indicator is visible.

## Changed

1. Removed option: doneProcess. In switchTabAndPane, steps before the current step are always marked step-done only if indicatorVisible is true.
2. Re-init hygiene retained: tabs have step-done cleared on init, then reapplied if submitted: true.

## Implications/behavior notes

If you previously relied on doneProcess: true to mark tabs as done while keeping the indicator hidden (indicator.visible: false), those tabs will no longer be auto-marked as done in `2.2.10`. This is a behavioral change.

## Back-compat shim (optional)
If you want the 2.2.8/2.2.9 behavior back (mark previous tabs as done regardless of indicator visibility when wanted), add this in options parsing:






# Release v2.2.9

## Summary

Style-only release. No behavioral or API changes from `2.2.8`. The JavaScript is effectively identical to `2.2.8` (version bump + style polish in CSS).

## What’s in the JS

1. Keeps Classic as the default indicator theme.
2. Cleans st-theme-* before applying current theme.
3. Removes numbered bubbles when switching to Classic.
4. Clears step-done on tabs during init, then reapplies when submitted: true.
5. Submit defensively updates the last indicator only if the indicator exists.

## Migration

None. Drop-in replacement for `2.2.8`.

This keeps behavior the same but avoids adding a new listener each time you change steps.

If you want more, I can provide the fully optimized `2.2.9` build with ResizeObserver and delegated listeners, compatible with your current API.





# Release v2.2.8

## Summary

Stability and re-init hygiene improvements. Prevents stale “done” styling on tabs after re-initialization or mode changes and hardens submit handling when the indicator isn’t rendered. No API or option changes.

## Changed

Initialization now clears step-done from all .st-tab before reapplying done state (e.g., when submitted: true). This avoids leftover “done” styling across re-inits or config toggles.
Submit behavior is more defensive: marks the last indicator as step-done only if an indicator block actually exists in the DOM, preventing edge-case errors on containers without indicators.

## Fixed

Re-initialization artifacts: “done” classes no longer accumulate on tabs. Tabs are normalized first and then re-marked based on submitted and navigation state.
Submit without indicator visible: avoids querying non-existent indicator elements by checking for .st-indicator-main before updating.


## Migration notes

No breaking changes from `2.2.6`.
If you rely on pre-completed/review mode, continue using submitted: true. The component now resets and reapplies step-done consistently on init.






# Release v2.2.6

## Summary

Safe re-initialization, better theme switching, and small robustness tweaks. Defaults now use the Classic indicator theme. Pre-existing indicator markup and theme classes are cleaned before rendering to avoid duplicates.

## Changed

Default indicator theme is now `Classic` (was Default in `2.2.0`).
Re-init safety: existing .st-indicator-main is removed before inserting a new indicator block.
Theme switching hygiene: old st-theme-* classes are removed before applying the new theme class, preventing class accumulation on re-init.
Position update robustness: updateStepper writes to .st-position only if it exists, avoiding DOM errors with non-positioned themes.

## Fixed

Duplicate indicators on multiple initializations (removed before re-render).
Residual numbered bubbles (.st-number) when switching from Default → Classic (classic theme renders without numbers).
Submit edge-case: avoid touching indicator DOM when indicator is hidden.

## Options changes (only new/changed/removed)

`Changed default`: indicator.theme now `defaults` to `Classic`.
No new options, no removals.

## Migration notes

If you want the numbered indicator (`2.2.0` default), explicitly set indicator: { visible: true, theme: 'Default' }.
No API changes vs `2.2.0`; callbacks and markup schema remain the same.

Performance and robustness improvements you can apply
Below is a drop-in optimized version of stepper for `2.2.6` that:

Hoists helpers to avoid re-allocation per instance.
Reuses or creates the tabs wrapper only once, avoiding duplicate wrappers on re-init.
Uses a per-instance ResizeObserver (fallback to window resize) attached once, instead of re-adding a resize handler on every step change.
Delegates tab clicks to the tabs container to reduce N listeners.
Guards all optional elements (e.g., submit button) to prevent errors.

## Why this improves things

1. No duplicate indicators or theme classes on re-init; tabs wrapper is reused instead of injected repeatedly.
2. ResizeObserver (fallback to a single window resize handler) is attached once per instance and cleaned on re-inits, fixing the previous listener leak across step changes.
3. Fewer DOM queries and class operations; helpers are hoisted and reused.
4. Event delegation cuts down the number of listeners, especially in large steppers.
5. All behaviors and API remain compatible with `2.2.6`, including the callback-driven Next flow and the Classic default theme.





# Release v2.2.0

## Summary

Adds a submitted state for post-completion/review flows, enhances submit button state handling, and makes small UX refinements while keeping the v2 API intact.

## Added

`submitted`: boolean (default false)
When true:
    allTabsDisabled is forced to false (tabs are enabled).
    All tabs that are enabled (data-disabled="false") are marked step-done.
    If the indicator is visible, all indicators are marked step-done.

## Changed

`allTabsDisabled behavior`:
    If submitted === true, allTabsDisabled is ignored and treated as false.
`Submit flow refinements`:
    On submit, the last tab and last indicator are marked step-done (if not already).
    The submit button is marked with data-disabled="true".
    Navigating back or clicking a tab sets data-disabled="false" on the submit button (useful for styling/guard logic).
`Internal`: utility helpers (hasClass, addClass, removeClass) replace direct classList mutations.

## Options changes (only new/changed/removed)

`Added`: submitted (boolean, default false)
`Changed`: allTabsDisabled is overridden to false when submitted === true

## Migration notes

No breaking API changes from `v2.0.0`.
If you rely on styling or logic for submit availability, target the new data-disabled attribute:
.submit-step[data-disabled="true"] { /* style disabled state */ }
If you want previously completed/review state on load, pass submitted: true.

## Usage example

```js
stepper('.my-stepper', {
    containerWidth: 420,
    indicator: { visible: true, theme: 'Classic' },
    doneProcess: true,
    allTabsDisabled: true,   // Ignored when submitted === true
    submitted: false,        // Set true to pre-mark as completed/review
    containerId: (id) => console.log('Stepper ID:', id),
    tabButtonEvent: (e, id) => { /* analytics/guards */ },
    nextButtonEvent: (e, { currentStep, nextButtonProcess, id }) => {
    const valid = true;    // your validation
    if (valid) nextButtonProcess(currentStep);
    },
    prevButtonEvent: (e, id) => { /* optional */ },
    submitButtonEvent: (e, id) => { /* final submit */ }
});
```

## Notes

1. When indicator.visible is true and submitted is true, the indicator dots are all pre-marked as step-done to reflect a completed/review state.
2. Buttons and panes remain controlled via aria-hidden and .show; ensure your CSS reflects these states.






# Release v2.0.0

## Summary

Major refactor with multi-instance support, a new DOM/CSS class scheme, themable indicators, and streamlined event handling. The API now targets a CSS selector, enabling you to initialize many steppers at once. Several breaking changes to markup, options, and callback signatures.

## Breaking changes

`API`: stepper now accepts a CSS selector and initializes all matches.
    Before: stepper('myStepperId', options)
    Now: stepper('.my-stepper', options)
`DOM/CSS`: class names and structure refactored to st-*.
    Tabs: stepper-tab → st-tab
    Panes: stepper-pane → st-pane
    Tabs scroll: stepper-tabs-scroll → st-tabs-scroll
    Indicator container: stepper-indicator-main → st-indicator-main
    Indicator item: stepper-indicator → st-indicator
    Position elements: stepper-position(-group)/stepper-total → st-position(-group)/st-total
    Data ids: stepper-1..n → tab-1..n (panes remain pane-1..n)
    Indicator anchor: [data-id="stepper-group"] → .st-group
`Indicator option`: indicatorVisible removed in favor of indicator.visible (nested).
`Callback signatures`:
    nextButtonEvent now receives an object including id: (event, { currentStep, nextButtonProcess, id }) => void
    prevButtonEvent, submitButtonEvent, tabButtonEvent now receive the container id as the second argument: (event, id)
Auto-advance on Next remains callback-driven (from v1.4.1). If you don’t call nextButtonProcess inside nextButtonEvent, the step will not advance.

## Added

Multi-instance initialization via CSS selector; each instance gets a unique ID.
`indicator.theme` with two themes:
    `Default`: numbered indicators (no X/Y counter)
    `Classic`: dots plus X/Y counter (closest to previous behavior)
allTabsDisabled (default true): sets data-disabled="true" on tabs initially for styling/UX purposes.
containerId callback: invoked with the generated ID per instance so you can track or store it.
Event delegation for button clicks inside each container to reduce attached listeners.
Throttled scroll positioning using requestAnimationFrame.

## Changed

`Accessibility`: continues to use aria-hidden for button visibility and pane visibility.
Step `done` styling interoperates with new .st-indicator and .st-tab classes.

## Removed

indicatorVisible (use indicator.visible).
Old stepper-* classes and [data-id="stepper-*"] markers.

## Options changes (only new/changed/removed)

`Added`: indicator.visible (boolean, default false)
`Added`: indicator.theme (`Default` | `Classic`, default `Default`)
`Added`: allTabsDisabled (boolean, default true)
`Added`: containerId (function) → called with generated instance ID
`Changed`: nextButtonEvent signature → (event, { currentStep, nextButtonProcess, id })
`Changed`: prevButtonEvent, submitButtonEvent, tabButtonEvent signatures → (event, id)
`Removed`: indicatorVisible (replace with indicator.visible)

## Migration guide

### Initialize by selector

`Before`:
    stepper('myStepper', { ... })
`After`:
    stepper('.my-stepper', { ... })

### Update markup and classes

stepper-tab → st-tab
stepper-pane → st-pane
stepper-tabs-scroll → st-tabs-scroll (created automatically; keep a .st-tabs container for your tabs)
stepper-indicator-main/stepper-indicator → st-indicator-main/st-indicator
data-id="stepper-1..n" → data-id="tab-1..n"
Ensure a .st-group element exists (indicator anchor); tabs should be inside a .st-tabs container. The library will inject .st-tabs-scroll > .st-tabs-wrapper and move .st-tab into it.

### Replace indicatorVisible

`Before`:
`indicatorVisible: true
`After`:
    indicator: { visible: true, theme: `Classic` } // `Classic` most closely matches old X/Y indicator

### Update callbacks

`nextButtonEvent`:
    Before: (e, { currentStep, nextButtonProcess }) => { ... }
    After: (e, { currentStep, nextButtonProcess, id }) => { ... }
`prevButtonEvent` / submitButtonEvent / tabButtonEvent:
    Before: (e) => { ... }
    After: (e, id) => { ... }

### Keep CSS for aria-hidden
.prev-step[aria-hidden="true"],
.next-step[aria-hidden="true"],
.submit-step[aria-hidden="true"] { display: none; }

Preserve “done” styling

Update selectors to target .st-tab.step-done and .st-indicator.step-done.

## Usage example

```js
// Initialize all instances that match the selector
stepper('.my-stepper', {
    containerWidth: 420,
    indicator: { visible: true, theme: 'Classic' }, // or 'Default'
    doneProcess: true,
    allTabsDisabled: false,
    containerId: (id) => {
    // store or log the generated instance id
    console.log('Stepper ID:', id);
    },
    tabButtonEvent: (e, id) => {
    // analytics or guard logic per instance
    },
    nextButtonEvent: (e, { currentStep, nextButtonProcess, id }) => {
    // validate, then advance
    const valid = true; // your validation
    if (valid) nextButtonProcess(currentStep);
    },
    prevButtonEvent: (e, id) => {
    // optional
    },
    submitButtonEvent: (e, id) => {
    // final submit
    }
});
```

## Notes

1. The `Classic` indicator theme mirrors the previous X/Y counter experience; the `Default` theme shows numbered indicators without the counter.
2. Pane visibility continues to be controlled via aria-hidden and .show, so ensure your CSS reflects these states.






# Release v1.4.1

## Summary
Adds a tab click callback and improves accessibility and event handling. The Next button flow is now callback-driven to support validation before advancing.

## Added
1. `tabButtonEvent`: function | undefined
2. Fired when a user clicks a step tab (receives the click event). The component still switches to the clicked step after the callback runs.
3. License header: Explicit MIT license comment block in the source.

## Changed

1. Next button behavior (breaking): Advancing is now controlled by your nextButtonEvent. To move forward, call nextButtonProcess(currentStep) from inside your nextButtonEvent. If you do not provide nextButtonEvent, clicking Next will not advance.
2. Visibility toggling now uses aria-hidden rather than inline styles. Update your CSS to hide elements with [aria-hidden="true"].

## Fixed

1. Resize handler leak: Uses a named handler and properly removes/re-adds it.
2. Duplicate event handlers: removeEventListener is called before addEventListener to avoid stacking listeners on re-init.

## Update Options (props)

`tabButtonEvent`: function | undefined (new)
Called on tab click before switching; receives the click event.
`nextButtonEvent`: function | undefined
`Signature`: (event, { currentStep, nextButtonProcess }) => void
Call nextButtonProcess(currentStep) when you’re ready to advance.


## Migration guide

Keep old Next behavior (auto-advance) by providing:
`nextButtonEvent`: (_, { currentStep, nextButtonProcess }) => {
    nextButtonProcess(currentStep);
}
Update CSS to hide buttons using aria-hidden:
.prev-step[aria-hidden="true"],
.next-step[aria-hidden="true"],
.submit-step[aria-hidden="true"] { display: none; }

## Usage example

```js
stepper('myStepper', {
    containerWidth: 420,
    indicatorVisible: true,
    doneProcess: true,
    tabButtonEvent: (e) => { /* analytics or guard logic */ },
    nextButtonEvent: (e, { currentStep, nextButtonProcess }) => {
    // e.g., validate current step, then advance
    const isValid = true; // your validation
    if (isValid) nextButtonProcess(currentStep);
    },
    prevButtonEvent: (e) => { /* optional */ },
    submitButtonEvent: (e) => { /* final submit */ }
});
```

## Notes

1. DOM structure remains the same as `1.3.3`. The indicator and scroll-to-active behavior are unchanged, with improved event cleanup.





# Release v1.3.3 — Initial release

## Summary

First public release of stepper(), a zero‑dependency, multi‑step UI component with optional progress indicator, responsive tab scrolling, and navigation callbacks.

## Features

1. `Step indicator (optional)`: Renders dots and an X/Y counter; highlights the active step and marks completed steps.
2. `Responsive scrolling`: Automatically scrolls the active tab into view when the container is narrow.
3. `Navigation`: Clickable step tabs, Next/Previous buttons, and an optional Submit button on the last step.
4. `Done state`: Previously completed steps can be visually marked as done.
5. `Event hooks`: Callbacks for next, previous, and submit actions.

## Options (props)

`containerWidth`: number (default 420)
    If CONTAINER.offsetWidth <= containerWidth, the active tab auto‑scrolls into view.
`indicatorVisible`: boolean (default `false`)
    Shows and updates the step indicator and X/Y counter.
`doneProcess`: boolean (default `false`)
    Adds step-done to completed tabs and indicators.
`nextButtonEvent`: `function` | undefined
    Called after advancing a step (receives the click event).
`prevButtonEvent`: `function` | undefined
    Called after moving back a step (receives the click event).
`submitButtonEvent`: `function` | undefined
    Bound to .submit-step click on the final step.

## Usage (example)

```js
stepper('myStepper', {
    containerWidth: 420,
    indicatorVisible: true,
    doneProcess: true,
    nextButtonEvent: (e) => { /* validate or fetch */ },
    prevButtonEvent: (e) => { /* custom logic */ },
    submitButtonEvent: (e) => { /* final submit */ }
});
```

## Expected DOM structure (minimal)

.stepper-tab[data-id="stepper-1..n"] and .stepper-pane[data-id="pane-1..n"]
.next-step and .prev-step buttons; optional .submit-step
Optional: [data-id="stepper-group"] (indicator anchor), .stepper-tabs-scroll (scroll container)

##  No breaking changes

Initial stable feature set.
