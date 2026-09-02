import { Border, Box, Button, Stack, TypeFace } from '@spooder/webui-component-library';
import React from 'react';

interface Props {
  moduleKey: string;
  moduleName?: string;
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Keeps one broken module from taking down the whole WebUI.
 *
 * This matters more now that modules are federated remotes rather than code compiled in with
 * everything else. A remote is built separately, released separately, and can be a version
 * older than the host expects - so "this module throws" stopped being a thing only a developer
 * sees during a refactor and became something a user can hit by installing an update.
 *
 * Has to be a class: componentDidCatch has no hook equivalent.
 */
export default class ModuleErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Kept in the console with its component stack, because that is what a module author needs
    // and the card below deliberately does not show.
    console.error(`Module '${this.props.moduleKey}' crashed while rendering:`, error, info);
  }

  // Reset on navigating away and back: the tab is remounted with a fresh key, and a module that
  // failed once because of transient state should get another chance without a page reload.
  componentDidUpdate(previous: Props) {
    if (previous.moduleKey !== this.props.moduleKey && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    const { error } = this.state;
    if (!error) {
      return this.props.children;
    }

    const name = this.props.moduleName ?? this.props.moduleKey;
    return (
      <Box padding="medium" width="100%">
        <Border>
          <Box padding="small" width="100%">
            <Stack spacing="small" width="100%">
              <TypeFace fontSize="large">{name} stopped working</TypeFace>
              <TypeFace fontSize="small">
                The rest of Spooder is unaffected — only this tab is. If it keeps happening,
                check for an update to the module, or look in the browser console for the
                details.
              </TypeFace>
              <TypeFace fontSize="small">{error.message}</TypeFace>
              <Button label="Try again" onClick={() => this.setState({ error: null })} />
            </Stack>
          </Box>
        </Border>
      </Box>
    );
  }
}
