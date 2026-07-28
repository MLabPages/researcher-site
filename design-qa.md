# Design QA

## Comparison target

- Source visual truth: `C:\Users\mkn09\.codex\generated_images\019f65de-c903-7bf1-9a5e-9dcab15b68ca\exec-360a8dad-d8fc-415c-8b15-90080c1889e8.png`
- Intended viewport: desktop `1440 × 1024`, plus mobile responsiveness.
- Implementation: the static M-Lab ツール広場 in this repository.

## Evidence

- Source visual was inspected in the design-selection step.
- The implementation could not be captured in the in-app browser: the local HTTP URL was refused, and `file://` access was blocked by the browser security policy.
- Static verification passed: `node --check app.js`, `node --check data.js`, `git diff --check`, and all newly referenced image assets exist.

## Required fidelity surfaces

- Fonts and typography: pending browser-rendered comparison.
- Spacing and layout rhythm: pending browser-rendered comparison.
- Colors and visual tokens: implemented with the selected deep teal, coral, ochre, and paper-texture hero asset; pending rendered comparison.
- Image quality and asset fidelity: generated paper-festival hero asset and real main-screen captures for thesis checking and AR were added; pending rendered comparison.
- Copy and content: hero adds `新しい実験ツールを、続々展示中`; card previews now prioritize each tool's main function.

## Findings

- [P1] Browser-rendered comparison is unavailable.
  - Location: local browser preview.
  - Evidence: local HTTP access was refused and local-file navigation was blocked by the browser policy.
  - Impact: desktop/mobile visual fidelity and primary interactions cannot be claimed as verified.
  - Fix: open the changed site from a browser-accessible preview or after the user authorizes a deployment, then capture desktop and mobile states and rerun this QA.

## Implementation checklist

- [x] Add the selected paper-festival hero direction.
- [x] Add main-function previews and labels to cards.
- [x] Check JavaScript syntax, asset paths, and whitespace errors.
- [ ] Capture and compare rendered desktop/mobile pages.

## Comparison history

1. Initial pass: blocked before visual comparison because a local browser-rendered implementation could not be captured.

final result: blocked
