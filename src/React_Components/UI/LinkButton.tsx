import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faSquareArrowUpRight } from '@fortawesome/free-solid-svg-icons';
import { $, setClass } from './Helpers';

interface LinkButtonProps {
  name?: string;
  text: string;
  link: string;
  mode: LinkButtonMode;
  iconOnly?: boolean;
}

type LinkButtonMode = 'newtab' | 'copy';

export default function LinkButton(props: LinkButtonProps) {
  const { name, text, link, mode, iconOnly } = props;

  function clickLink() {
    if (mode === 'newtab') {
      window.open(link, '_blank');
    } else if (mode === 'copy') {
      copyTextToClipboard(link);
    }
  }

  function fallbackCopyTextToClipboard(text: string) {
    var textArea = document.createElement('textarea');
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = '0';
    textArea.style.left = '0';
    textArea.style.position = 'fixed';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
      setClass($('#linkButton-' + name), 'success', true);
      setTimeout(() => {
        setClass($('#linkButton-' + name), 'success', false);
      }, 5000);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  function copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
      fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(
      function () {
        console.log('Async: Copying to clipboard was successful!');
        setClass(document.querySelector('#linkButton-' + name), 'success', true);
        setTimeout(() => {
          setClass(document.querySelector('#linkButton-' + name), 'success', false);
        }, 5000);
      },
      function (err) {
        console.error('Async: Could not copy text: ', err);
      },
    );
  }

  let iconLink = faClipboard;
  if (mode == 'newtab') {
    iconLink = faSquareArrowUpRight;
  }
  return (
    <div className='link-button'>
      <button
        id={'linkButton-' + name}
        className={'link-button-button ' + mode + ' ' + (iconOnly ? 'icononly' : '')}
        type='button'
        onClick={clickLink}
      >
        {text} <FontAwesomeIcon icon={iconLink} size='lg' />
      </button>
    </div>
  );
}
