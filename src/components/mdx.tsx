import { Mermaid } from '@/components/mermaid';
import { CodeBlock, Pre, type CodeBlockProps } from 'fumadocs-ui/components/codeblock';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { Children, isValidElement, type ComponentProps, type ReactNode } from 'react';

const languageLabels: Record<string, string> = {
  bash: 'Bash',
  css: 'CSS',
  html: 'HTML',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  markdown: 'Markdown',
  md: 'Markdown',
  python: 'Python',
  py: 'Python',
  shell: 'Shell',
  sh: 'Shell',
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
  yaml: 'YAML',
  yml: 'YAML',
};

function findCodeLanguage(node: ReactNode): string | undefined {
  if (!isValidElement(node)) {
    for (const child of Children.toArray(node)) {
      const language = findCodeLanguage(child);
      if (language) return language;
    }
    return undefined;
  }

  const props = node.props as { className?: string; children?: ReactNode };
  const language = props.className?.match(/(?:^|\s)language-([^\s]+)/)?.[1];
  return language ?? findCodeLanguage(props.children);
}

function PostCodeBlock(props: ComponentProps<'pre'>) {
  const { children, ...rest } = props;
  const blockProps = rest as Omit<CodeBlockProps, 'children'>;
  const language = findCodeLanguage(children);
  const languageLabel = language
    ? languageLabels[language.toLowerCase()] ?? language.toUpperCase()
    : undefined;

  return (
    <CodeBlock
      {...blockProps}
      className="post-code-block"
      title={blockProps.title ?? (
        languageLabel ? <span className="post-code-language">{languageLabel}</span> : undefined
      )}
    >
      <Pre>{children}</Pre>
    </CodeBlock>
  );
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    Mermaid,
    pre: PostCodeBlock,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
