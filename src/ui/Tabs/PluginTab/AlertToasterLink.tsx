import React from 'react';
import LinkButton from '../../Common/LinkButton';

export default function AlertToasterLink() {
  return (
    <div className='no-plugins-div'>
      <h1>No plugins yet, get an Alert Toaster!</h1>
      <p>
        Alert Toaster has slide in alerts for Spooder, Twitch, and any plugin that calls
        /spooder/alert on OSC. Get an alert when someone triggers a chat command or get alerts when
        something crashes on Spooder...including Spooder itself.
      </p>
      <LinkButton
        mode='newtab'
        label='Get the Latest Release'
        link={'https://github.com/GreySole/Spooder-AlertToaster/releases/tag/latest'}
        name={''}
        iconOnly={false}
      />
    </div>
  );
}
