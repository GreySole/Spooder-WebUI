import { Stack, TypeFace } from '@spooder/webui-component-library';
import React from 'react';
import ResponseSearchAndMatchCheatSheet from '../../eventCommand/response/ResponseSearchAndMatchCheatSheet';

// The pattern language reference, shown for both nodes that run the matcher: the Chat Search &
// Match trigger and the Search & Match operation node. Their fields are edited inline on the
// card; this is the part a form def can't express, and it's the whole reason either node's
// panel opens (see useInspectorHasContent).
export default function SearchMatchReference() {
  return (
    <Stack spacing='small'>
      <TypeFace fontWeight='bold'>Search & Match</TypeFace>
      <TypeFace fontSize='small'>
        Each word of the pattern becomes a Match output on this node, in order, carrying the word
        it matched - or take them all at once from All Matches.
      </TypeFace>
      <ResponseSearchAndMatchCheatSheet isOpen />
    </Stack>
  );
}
