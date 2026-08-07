import { TooltipButton } from '@spooder/webui-component-library';
import React from 'react';

interface TutorialButtonProps {
  tooltipText: string;
  iconSize?: string;
}

export default function TutorialButton(props: TutorialButtonProps) {
  const { tooltipText, iconSize } = props;
  const isTutorialEnabled = localStorage.getItem('tutorial') === 'true';
  return isTutorialEnabled ? (
    <TooltipButton tooltipText={tooltipText} iconSize={iconSize ?? 'medium'} />
  ) : null;
}
