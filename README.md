[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
# RoomRelease
This Webex Macro monitors the endpoint to confirm if a meeting has started, then subsequently checks if nobody shows up (via peoplePresence and peopleCount). In the event nobody shows up after a predetermined time - will release the room (in Exchange) and make it available for others to book.

Currently the release feature is in public beta so the endpoint needs to be running <b>beta</b> code and the following tsh (remotesupport) commands are required;<br>
• <i>xcommand Macros Macro Accessmode Set Name: </i>name-of-macro<i> Internal: True</i><br>
• <i>xconf Macros Experimental: True</i><br>
