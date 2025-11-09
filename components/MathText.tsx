'use client';

import katex from 'katex';

interface MathTextProps {
  text: string;
}

export function MathText({ text }: MathTextProps) {
  // Parse text for LaTeX delimiters and render with KaTeX
  const renderMath = (content: string): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = content;
    let key = 0;

    // Split by display math ($$...$$) first, then inline math ($...$)
    // Display math takes precedence

    while (remaining) {
      // Look for display math $$...$$
      const displayMatch = remaining.match(/\$\$([\s\S]*?)\$\$/);
      if (displayMatch && displayMatch.index !== undefined) {
        // Add text before display math
        if (displayMatch.index > 0) {
          const beforeText = remaining.slice(0, displayMatch.index);
          // Check for inline math in the text before display math
          parts.push(...renderInlineMath(beforeText, key));
          key += beforeText.length;
        }

        // Render display math
        const latex = displayMatch[1];
        try {
          const html = katex.renderToString(latex, {
            displayMode: true,
            throwOnError: false,
          });
          parts.push(
            <div
              key={`display-${key}`}
              className="my-4 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (err) {
          // Fallback to plain text on error
          console.error('KaTeX display math rendering error:', err);
          parts.push(<span key={`display-error-${key}`}>{`$$${latex}$$`}</span>);
        }
        key++;

        // Continue with remaining text
        remaining = remaining.slice(displayMatch.index + displayMatch[0].length);
      } else {
        // No more display math, process remaining for inline math
        parts.push(...renderInlineMath(remaining, key));
        break;
      }
    }

    return parts;
  };

  // Helper to render inline math $...$
  const renderInlineMath = (content: string, startKey: number): (string | JSX.Element)[] => {
    const parts: (string | JSX.Element)[] = [];
    let remaining = content;
    let key = startKey;

    while (remaining) {
      // Look for inline math $...$
      const inlineMatch = remaining.match(/\$(.*?)\$/);
      if (inlineMatch && inlineMatch.index !== undefined) {
        // Add text before inline math
        if (inlineMatch.index > 0) {
          parts.push(remaining.slice(0, inlineMatch.index));
        }

        // Render inline math
        const latex = inlineMatch[1];
        try {
          const html = katex.renderToString(latex, {
            displayMode: false,
            throwOnError: false,
          });
          parts.push(
            <span
              key={`inline-${key}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch (err) {
          // Fallback to plain text on error
          console.error('KaTeX inline math rendering error:', err);
          parts.push(<span key={`inline-error-${key}`}>{`$${latex}$`}</span>);
        }
        key++;

        // Continue with remaining text
        remaining = remaining.slice(inlineMatch.index + inlineMatch[0].length);
      } else {
        // No more inline math, add remaining text
        if (remaining) {
          parts.push(remaining);
        }
        break;
      }
    }

    return parts;
  };

  const renderedContent = renderMath(text);

  return <span className="math-text inline">{renderedContent}</span>;
}
