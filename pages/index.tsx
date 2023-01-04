import type { GetServerSidePropsContext, NextPage } from 'next';
import { QuranPage, VersesSelection } from '@types';
import { getQuranPage } from '../lib/getQuran';
import { useState } from 'react';
import QuranReader from '../components/App/QuranReader';
import QuranPlayer from '../components/App/QuranPlayer';

interface Props {
  page: QuranPage;
}

const Home: NextPage<Props> = ({ page }) => {
  const [versesSelection, setVersesSelection] = useState<VersesSelection>({
    from: null,
    to: null,
  });

  return (
    <div className="flex flex-col gap-2 h-screen bg-gray-100">
      <div className="flex-auto flex gap-2 p-6">
        <div className="flex-initial w-4/12">
          <QuranPlayer versesSelection={versesSelection} />
        </div>
        <div className="flex-initial">
          <div className="bg-white shadow rounded">
            <QuranReader page={page} onSelectionChange={setVersesSelection} />
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = ({ query }: GetServerSidePropsContext) => {
  const pageId = parseInt((query.page || '1') as string);
  const page = getQuranPage(pageId);

  return {
    props: {
      page,
    },
  };
};

export default Home;
