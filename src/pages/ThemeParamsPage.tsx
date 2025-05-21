import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';
import PhaserGame from '@/components/PhaserGame'

export const ThemeParamsPage: FC = () => {
  return (
    <Page>
      <PhaserGame />
    </Page>
  );
};
