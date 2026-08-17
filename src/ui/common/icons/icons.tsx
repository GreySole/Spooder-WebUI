import { faDiscord, faTwitch } from '@fortawesome/free-brands-svg-icons';
import obsIcon from './svg/obs.svg';

// Module tab icons. These are FontAwesome definitions rather than the brand SVGs in ./svg,
// because the navigation tints every icon with the theme gradient (see TabButton) and only
// the FontAwesome path honours that color. Vite inlines small .svg imports as data URIs, and
// the component library's Icon only recolors a string icon whose URL ends in '.svg' -
// everything else falls through to a plain <img>, which renders the mark's baked-in black.
export const TwitchIcon = faTwitch;
export const DiscordIcon = faDiscord;
export const ObsIcon = obsIcon;
