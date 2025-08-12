import type { FC } from 'react';

import { Page } from '@/components/Page.tsx';
import PhaserGame from '@/components/Game/PhaserGame'

export const ThemeParamsPage: FC = () => {
  return (
    <Page>
      <PhaserGame />
    </Page>
  );
};
