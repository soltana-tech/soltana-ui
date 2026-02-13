Evaluate documentation quality and alignment with the codebase to ensure comprehensive, accurate, and user-focused guidance.

## Task

Analyze the documentation site in `docs/` and any markdown docs to assess quality, accuracy, completeness, and usability.
Identify gaps, inconsistencies, redundancies, and opportunities for improvement.

### Analysis Areas

1. **Feature and Option Coverage**

   - Verify all public API functions are documented (`initSoltana`, `setTheme`, `setMaterial`, `setSurface`, `setOrnament`, `setOverrides`, `getState`, `reset`)
   - Verify all config types are documented (`Theme`, `Material`, `Surface`, `Ornament`, `SoltanaConfig`)
   - Verify all material options are documented (`flat`, `soft`, `neu`, `glass`, `metallic`, `stone`)
   - Verify all surface options are documented (`polished`, `frosted`, `stained`, `metallic`)
   - Verify all ornament options are documented (`none`, `baroque`, `carved`, `faceted`, `gilt`)
   - Verify all theme options are documented (`dark`, `light`, `sepia`, `auto`)
   - Verify all enhancers are documented (`initModals`, `initTabs`, `initTooltips`, `initAll`)
   - Verify all CSS component classes are documented (buttons, cards, inputs, badges, alerts, avatars, progress, switches, tooltips, tables, modals, skeletons)
   - Verify all utility classes are documented (material overrides, surface overrides, neumorphic utilities, glassmorphic utilities, ornamental frames/dividers/corners)
   - Flag any features/classes in code that lack documentation
   - Flag any documented features/classes that don't exist in code

2. **Code-Documentation Alignment**

   - Verify examples in docs actually work with current API
   - Verify parameter defaults in docs match code defaults
   - Verify CSS class names in docs match actual class names in SCSS
   - Verify behavior descriptions match actual implementation
   - Verify the 4-tier system description matches actual tier interactions
   - Flag outdated or incorrect examples
   - Flag class names or config values that don't match implementation
   - Flag missing edge case documentation

3. **User-Focused Content**

   - Verify docs explain "how to use" rather than "how it works internally"
   - Flag overly technical or implementation-focused explanations
   - Verify common use cases are covered with clear examples
   - Verify docs answer "why would I use this?" for each material/surface/ornament
   - Flag missing practical guidance or best practices
   - Verify configuration recommendations are user-centric

4. **Accessibility and Navigation**

   - Verify all sections are reachable from tab navigation and quick-nav links
   - Verify section headings are clear and descriptive
   - Flag orphaned or unreferenced sections
   - Flag broken internal links or anchors
   - Verify code examples are properly formatted and readable
   - Verify all code blocks have proper syntax highlighting

5. **Redundancy and Organization**

   - Identify duplicate content across pages
   - Identify overlapping explanations of the same concept
   - Flag content that could be consolidated
   - Assess whether page organization makes sense
   - Suggest reorganization if needed for better flow

6. **Completeness and Clarity**

   - Verify all config options have clear descriptions
   - Verify all materials/surfaces/ornaments have visual examples
   - Verify error conditions are documented (invalid config values)
   - Verify CSS custom property overrides are documented
   - Flag vague or ambiguous explanations
   - Flag missing context or prerequisites

### Red Flags to Report

- Documented features that don't exist in code
- Code features that lack documentation
- Incorrect config defaults or types
- CSS class names in docs that don't match SCSS
- Examples that don't match current API
- Broken or missing links/anchors
- Duplicate or redundant content
- Overly technical explanations (implementation details vs. usage)
- Missing practical examples or use cases
- Inconsistent terminology or naming
- Missing error handling documentation
- Incomplete config option documentation

### Deliverables

Provide a report including:

- List of missing documentation with specific features/classes
- List of inaccurate or outdated documentation with examples
- Redundant content that could be consolidated
- Suggested reorganization or restructuring
- Missing practical examples or use cases
- Accessibility issues (broken links, orphaned sections)
- Recommendations for improving clarity and user focus
- Impact assessment of proposed changes
