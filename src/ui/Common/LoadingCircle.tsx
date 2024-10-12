import React from 'react';
import DashedCircle from '../Icons/DashedCircle.svg';

export default function LoadingCircle() {
  return (
    <div className='loading-circle'>
      <img src={DashedCircle} height='250px' />
    </div>
  );
}
