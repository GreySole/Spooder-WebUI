import React from 'react';
import './ShareTab.css';
import LoadingCircle from '../common/LoadingCircle';
import useShare from '../../app/hooks/useShare';
import ShareTabFormContextProvider from './shareTab/context/ShareTabFormContext';
import ShareEntry from './shareTab/ShareEntry';
import ShareSaveButton from './shareTab/input/ShareSaveButton';

export default function ShareTab() {
  const { getShares } = useShare();
  const { data: shares, isLoading, error } = getShares();

  if (isLoading) {
    return <LoadingCircle></LoadingCircle>;
  }

  return (
    <ShareTabFormContextProvider shares={shares}>
      <div className='share-tab-content'>
        {Object.keys(shares).map((s: string) => {
          return <ShareEntry key={s} shareKey={s}></ShareEntry>;
        })}
      </div>
      <ShareSaveButton />
    </ShareTabFormContextProvider>
  );
}
