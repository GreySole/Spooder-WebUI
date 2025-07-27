* Sliders should have a more consistent design with the rest of the app.
* Sliders should have default doubleClick behavior to reset to the default value, to be overridden by passing a custom doubleClick handler, if needed.
* Loading animation should be consistent across the app. Some use the spinner, some use the 4 bars...
* Figure out a way to make sure inputs and labels line up for better readability. Possibly by utilizing subgrid or flexbox.
* Several UI elements are able to be highlighted, impacting the usability of the app. Text should only be selectable when it is meant to be copied, such as in the logs or event details. Should implement a global user-select: none; style to prevent this, and apply user-select: text; to elements that should be selectable.
* Maybe text highlighting color should match the theme color, or at least be more visible depending on the theme color.
* Add ability to change the size of the menu sidebar, once below a certain width, it should switch to just the icons.
* Modals should animate in and out
* Twitch & Discord module buttons could use more detail such as a description, then add a button to open the module settings.
* Need to make sure to provide toasts for all actions that need them, such as saving settings, deleting events, etc, anything that requires feedback to the user.