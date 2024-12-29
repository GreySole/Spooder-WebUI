import React from 'react';
import LinkButton from './LinkButton';
import Button from '../controlled/Button';
import Columns from '../../layout/Columns';
import TypeFace from '../../layout/TypeFace';

interface ButtonRowButton {
  icon: any;
  iconSize: string;
  color?: string;
  isLink?: boolean;
  linkName?: string;
  link?: string;
  isActive?: boolean;
  onClick?: () => void;
}

interface ButtonRowProps {
  buttons: ButtonRowButton[];
}

export default function ButtonRow(props: ButtonRowProps) {
  const { buttons } = props;

  const buttonMap = buttons.map((button, index) => {
    let className = 'plugin-button';
    if (index == 0) {
      className += ' start';
    } else if (index == buttons.length - 1) {
      className += ' end';
    }
    if (button.isLink) {
      return (
        <LinkButton
          width='5rem'
          className={className}
          mode='download'
          name={button.linkName + '.zip'}
          iconOnly={true}
          iconSize={button.iconSize}
          link={button.link ?? ''}
        />
      );
    } else {
      return (
        <Button
          width='5rem'
          className={className}
          icon={button.icon}
          iconSize={button.iconSize}
          color={button.color}
          colorOnHover={!button.isActive}
          onClick={button.onClick ?? (() => {})}
        />
      );
    }
  });

  return (
    <TypeFace fontSize='medium'>
      <Columns spacing='none' padding='small'>
        {buttonMap}
      </Columns>
    </TypeFace>
  );
}
