'use client';
import {
  SearchDialog,
  SearchDialogClose,
  SearchDialogContent,
  SearchDialogHeader,
  SearchDialogIcon,
  SearchDialogInput,
  SearchDialogList,
  SearchDialogOverlay,
  type SharedProps,
} from 'fumadocs-ui/components/dialog/search';
import { useDocsSearch } from 'fumadocs-core/search/client';
import { oramaStaticClient } from 'fumadocs-core/search/client/orama-static';
import { create } from '@orama/orama';
import { createTokenizer } from '@orama/tokenizers/mandarin';
import { usePathname } from 'next/navigation';

function initOrama(locale?: string) {
  if (locale === 'zh') {
    return create({
      schema: { _: 'string' },
      components: { tokenizer: createTokenizer() },
    });
  }

  return create({
    schema: { _: 'string' },
    language: 'english',
  });
}

export default function DefaultSearchDialog(props: SharedProps) {
  const pathname = usePathname();
  const locale = pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en';
  const { search, setSearch, query } = useDocsSearch({
    client: oramaStaticClient({
      from: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/search`,
      initOrama,
      locale,
    }),
  });

  return (
    <SearchDialog search={search} onSearchChange={setSearch} isLoading={query.isLoading} {...props}>
      <SearchDialogOverlay />
      <SearchDialogContent>
        <SearchDialogHeader>
          <SearchDialogIcon />
          <SearchDialogInput />
          <SearchDialogClose />
        </SearchDialogHeader>
        <SearchDialogList items={query.data !== 'empty' ? query.data : null} />
      </SearchDialogContent>
    </SearchDialog>
  );
}
