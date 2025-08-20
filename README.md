# Spooder-WebUI

Source code for Spooder's WebUI

# Developing

Paste these folders next to the build folder at your Spooder's root. Use `npm run start-front` to start the development server. Use `npm run dev` on Spooder to run in Dev mode. When you're done, use `npm run build-front` to replace the build folder with a fresh one.

Logo by tyzzex

# React Hook Form DONTS

React Hook Form makes forms easy to build, but it is sensitive to component structure. Bad structure can cause the whole form to re-render on input in text components, breaking focus on text components. This usually happens when form components are inside the Modal component.

## Leave form provider components alone

Don't add modals or any components in the same component that returns the form provider. ALWAYS use the children prop!

## Watch your watch function usage

In some cases, using watch() can cause re-renders when they're used in the same place as components. It's best to isolate watch usage to its own component.

## You can't initialize useState values and pass them to Modal Content
