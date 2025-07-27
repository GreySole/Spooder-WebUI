# Bugs

A list of known bugs in Spooder-WebUI

## Front-End

### General UI

* Input and button elements do not align in certain places, such as the events footer. Need to make sure they adopt consistent and matching heights.
* Color pickers don't disappear when another one is opened
* Slider knobs are transparent for sliders values outside 0-1
* Footer buttons need to be fixed; many are the wrong size, component type, or have inconsistent layout.
* Footer animates in cleanly, but does not animate out
* Need to check all tabcontent for consistency, after menu placement changes, some might not be full-width in the right places. ***I think this is fixed, but needs to be checked.***
* LinkButtons, SaveButtons, etc. need to be combined with the regular Button component, so that they can be used in places where a button is expected and use functionality/style available to Button.
* "Remember where I was" button needs to be updated. Currently, the function only applies to the current tab (the tab the switch is on, Config tab), but it should apply to last tab visited.
* ~~input clear button disappears when button itself is focused, should stay visible~~
* ~~Events modal is not full screen~~
* ~~Hamburger menu button overlaps with content in the navigation menu. Need to adjust the nav menu to account for the new menu layout.~~
* ~~Maybe remove navigation menu entirely? Why do we need it?~~


### Theme

* Light mode needs more work again.
* Color warnings for custom Spooder logo are not correct any more because the logo no longer appears on the darker background variable color.

## Back-End

### Events

* ~~User is able to create events with no name~~
* ~~User is able to create event groups with no name~~