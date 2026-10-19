import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Box, Button } from '@spooder/webui-component-library';
import ToggleGroupButton from './ToggleGroupButton';
import ToggleModGroupButton from './ToggleModGroupButton';

interface GroupSettingsMenuProps {
  groupName: string;
}

// The group's on/off switches behind one button, opening a small menu under it - the same look
// as the Filter button in the footer, which this borrows the library's `filter-button` and
// `dropdown` styles from.
export default function GroupSettingsMenu(props: GroupSettingsMenuProps) {
  const { groupName } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [above, setAbove] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Opens upward when there isn't room below the button, the way the Filter button does. The
  // fixed footer covers the bottom of the window, so room is measured to its top edge rather than
  // the window's. Re-measured as the page scrolls or resizes, since the button moves under the
  // open menu.
  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }
    function place() {
      const button = rootRef.current;
      const dropdown = dropdownRef.current;
      if (!button || !dropdown) {
        return;
      }
      const footerHeight =
        parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--footer-height')) ||
        0;
      const roomBelow = window.innerHeight - footerHeight - button.getBoundingClientRect().bottom;
      setAbove(dropdown.getBoundingClientRect().height + 5 > roomBelow);
    }
    place();
    window.addEventListener('resize', place);
    // Capture: the page scrolls inside a container, and scroll events don't bubble.
    window.addEventListener('scroll', place, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place, true);
    };
  }, [isOpen]);

  // Closes on a press anywhere outside it, like any menu.
  useEffect(() => {
    if (!isOpen) {
      return;
    }
    function onPointerDown(e: PointerEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [isOpen]);

  return (
    <Box padding='medium'>
      <div className='filter-button' ref={rootRef}>
        <Button
          label='Group Settings'
          icon={faGear}
          iconSize='large'
          onClick={() => setIsOpen((open) => !open)}
        />
        {isOpen ? (
          // The library's dropdown is a fixed 130px hung from the right edge, sized for short
          // filter names; these buttons are wider, and sit at the left of the group.
          <div
            ref={dropdownRef}
            className={`dropdown ${above ? 'above' : 'below'}`}
            style={{ width: 'max-content', right: 'auto', left: 0 }}
          >
            <ToggleGroupButton groupName={groupName} />
            <ToggleModGroupButton groupName={groupName} />
          </div>
        ) : null}
      </div>
    </Box>
  );
}
