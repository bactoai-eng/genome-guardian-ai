<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the hero DNA on adaptive, depth-sorted Canvas 2D using CSS palette tokens, reduced mobile detail and paused off-screen rendering; this preserves cinematic depth without a heavy 3D dependency and keeps decorative animation separate from layout.
- Keep MCP server endpoints separate from public site documentation and navigation; internal integrations must remain available without a public documentation page.
- Keep phone hero statistics in a separate band and the shared pilot CTA fixed outside page sections; this preserves readable content and stable touch access.
- Load the homepage demo near the viewport or on its anchor request using DeferredDemo; this keeps analyzer dependencies off the initial request path without removing demo access.
- Scope shared secondary-page opening typography through page-opening; this keeps heading rhythm consistent without affecting content-section typography.
- Force the dark theme centrally in the root (html class, color-scheme meta, useTheme); light tokens stay in CSS unused so the site looks identical on every device.
- Use a dedicated primary-text token for emerald labels, input-boundary tokens for fields, and a shared focus-visible outline; text and controls require separate contrast from filled buttons.
- Use ResultsWatermark for all result views and draw the same asset before content via the PDF addPage event; this keeps watermark placement consistent across sample results, saved summaries, and every report page.

- Keep model-result presentation in a browser-safe adapter shared by AmrSummaryView and its lazily loaded PDF exporter; this keeps displayed/exported fields identical without changing analysis handling or history storage.
