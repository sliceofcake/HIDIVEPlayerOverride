# HIDIVEPlayerOverride
Change the behavior of HIDIVE's video player. Option to hide clutter. Improved subtitles appearance.  
  
Run this JavaScript in your browser when viewing a HIDIVE video player page for:  
• altered keyboard shortcut: [left] skip backward by 1s instead of 10s  
• altered keyboard shortcut: [right] skip forward by 1s instead of 10s  
• altered keyboard shortcut: [up] raise volume, comparable to what was already implemented  
• altered keyboard shortcut: [down] raise volume, comparable to what was already implemented  
• new keyboard shortcut: [s] skip forward by 1m:25s, which is 5 seconds less than the length of OPs and EDs  
• new keyboard shortcut: [0] set playbackRate to 1.0  
• new keyboard shortcut: [1] set playbackRate to 1.1  
• new keyboard shortcut: [2] set playbackRate to 1.2  
• new keyboard shortcut: [3] set playbackRate to 1.3  
• new keyboard shortcut: [4] set playbackRate to 1.4  
• new keyboard shortcut: [5] set playbackRate to 1.5  
• new keyboard shortcut: [6] set playbackRate to 1.6  
• new keyboard shortcut: [7] set playbackRate to 1.7  
• new keyboard shortcut: [8] set playbackRate to 1.8  
• new keyboard shortcut: [9] set playbackRate to 1.9  
• new keyboard shortcut: [h] toggle hidden-ness of non-subtitles stuff in front of video (when "on", merely restores control to HIDIVE)  
• new keyboard shortcut: [shift+h] toggle hidden-ness of subtitles (when "on", merely restores control to HIDIVE)  
  
Remember that you already have some shortcuts (these are left alone):  
• [f] toggle fullscreen  
• [space] play/pause  
  
You can also create a bookmark with the URL/link being the hidivePlayerOverride.txt text. Then, whenever you click on the bookmark, it will run the script. Bookmarks that run JavaScript instead of going to a webpage are called bookmarklets.  
  
Why this works  
HIDIVE uses an HTML5 video player. This allows for customer scripting.  
  
Touchy notes:  
• This script makes some assumptions about how HIDIVE's video player is laid out. If the layout changes in the future, this script will likely not work as intended until it is revised.  
• This script was tested narrowly on a Macbook Pro running Chrome. Different browsers / operating systems / screen sizes may yield unintended results.  
• This script will overlap subtitles if multiple subtitle channels appear at the same time. I likely won't fix this until I watch an episode where I see it happen.  