import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard, faDownload, faSquareArrowUpRight } from '@fortawesome/free-solid-svg-icons';
import { $, setClass } from '../../../util/deprecated_util';
import Button from '../controlled/Button';
import { StyleSize } from '../../../Types';

interface LinkButtonProps {
  width?: string;
  className?: string;
  name?: string;
  label?: string;
  iconSize?: string;
  link: string;
  mode: 'newtab' | 'copy' | 'download';
  iconOnly?: boolean;
}

export default function LinkButton(props: LinkButtonProps) {
  const { width, className, name, label, link, mode, iconOnly, iconSize } = props;

  function clickLink() {
    if (mode === 'newtab') {
      window.open(link, '_blank');
    } else if (mode === 'copy') {
      copyTextToClipboard(link);
    } else if (mode === 'download') {
      downloadLink(link);
    }
  }

  function downloadLink(downloadLink: string) {
    fetch(downloadLink, {
      method: 'GET',
      headers: { 'Content-Type': 'application/zip' },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name ?? 'backup.zip';
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
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
  } else if (mode == 'download') {
    iconLink = faDownload;
  }
  return (
    <Button
      width={width}
      className={className}
      label={label}
      icon={iconLink}
      iconSize={iconSize ?? StyleSize.large}
      onClick={() => clickLink()}
    />
  );
}
