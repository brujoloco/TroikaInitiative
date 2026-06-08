# TroikaInitiative
A Roll20 Script to handle the amazing and ultra random Troika! RPG Initiative System

-------------------------------------------
Overview

TroikaInitiative is a custom API script for Roll20, designed to track initiative in the Troika! RPG. 

When I created this API script I originally decided to use it for personal use, but after several iterations (hence the late version number) decided to simply throw it into my git and see if I could be bothered to upload it to Roll20. 

I built this so players and GMs can automate the unique card-drawing mechanics of the game, streamline combat organization, and ensure a smooth play experience. I love playing face to face with a very special custom deck of real cards I have printed for my playthroughs but found it a bit too much when playing on Roll20, hence why this was born, simple as that 8)

This script provides:

Automatic deck generation for characters and monsters.
Commands to manage combatants, roles, and cards.
Flexible options for reshuffling, drawing, and inspecting the initiative deck.
A clean, customizable UI using Roll20's chat interface.

Features

Customizable Decks:

Automatically adds cards for players (2 each by default) and a shared monster pool.
Also includes the "End of Round" card to signify the end of each combat phase.

Combatant Management:

Add tokens directly from the map or manually input combatants with !troika commands.
Toggle roles between "player" and "monster."
Adjust or remove combatants mid-combat.

Responsive Commands:

Draw cards one at a time, with alerts for player and monster turns.
Clear combatants and end combat when required.
Check the status of the remaining deck or reshuffle at any time.

Seamless Integration with Roll20:

Built-in commands for GMs, with detailed feedback in the Roll20 chat interface.
Supports intuitive workflows, from combat setup to round transitions.
Thematic UI:

Styled messages for improved clarity and immersion.
Differentiated visuals for player actions, monster actions, and system messages.
Requirements
Roll20 Pro Subscription (API scripting is required).

Installation
Go to your Roll20 game.
In Game Settings, enable the API Scripts tab (available for Pro users).
Upload the TroikaInitiative.js file or paste the script into a new API script file.
Save the script, and it will automatically initialize in your game.
Once loaded, the script will send a confirmation message in the Roll20 chat.

(This step might be unneeded in the future, if I decide to clone the roll20 repo and do the whole api upload, but meanwhile this can work no problem, thats how I have been using it for quite a while)


Usage Instructions

General Command Overview

Use the following commands in the Roll20 chat interface:

Command	Description

!troika start	Starts combat setup with the selected tokens.
!troika show	Re-displays the setup menu.
!troika addtoken	Adds selected tokens as combatants.
!troika addmanual <name>	Adds a manual combatant (e.g., !troika addmanual Goblin monster 4).
!troika confirm	Finalizes the deck and starts combat.
!troika draw	Draws the next card in the deck.
!troika status	Displays the deck's current status.
!troika reshuffle	Reshuffles the deck, including all cards.
!troika remove <name>	Removes a combatant by name (e.g., !troika remove Goblin).
!troika end	Ends combat and clears the initiative deck.
!troika help	Displays a detailed help menu with all commands.

----------------
Combat Workflow
1. Setup
Select all tokens representing combatants on the Roll20 map.
Run !troika start. The setup menu will appear for the GM.
Adjust combatants:
Toggle roles between Player/Monster.
Update card counts as needed.
Add additional tokens with !troika addtoken or manually with !troika addmanual.
2. Initiate Combat
Finalize the setup with !troika confirm.
The initiative deck is built, with a summary shown in chat.
Players and GMs draw cards using !troika draw.
3. During Combat
As cards are drawn:
Players and monsters are prompted to act.
The "End of Round" card concludes the round, allowing for adjustments.
Check the status of the deck at any time with !troika status.
4. Manage Combat
Mid-round adjustments:
Add or remove combatants (!troika addmanual, !troika remove).
Reshuffle the deck (!troika reshuffle).
End combat with !troika end, clearing the deck and combatants.

-------------------
Development Details

File Structure
The script is built with a modular, maintainable structure.
Modular functions handle:
Deck Management: Shuffling, drawing, and reshuffling cards.
Combatant Management: Adding, removing, and updating combatants.
Chat Output: Styled messages using custom CSS for clarity and immersion.
Key Variables

state[TroikaInitiative]: Stores the current state, including combatants, deck, and mode (setup/edit).

COLORS: Defines the color scheme for styled chat messages.

Customization
Modify styles by updating the COLORS object in the script.

Adjust default player card counts or monster card limits by altering the relevant functions (buildDeck or cmdSetCards).
Logging

Key events, such as deck reshuffles and combatant additions, are logged via log(...) for debugging.

Known Issues
Combatants without tokens must be added manually. Select appropriate roles and card counts.
Only GMs can execute commands; players should rely on GM-provided functionality.

Acknowledgments
This script was inspired by the rules and mechanics of Troika!, with an emphasis on preserving the fluidity and creativity of gameplay.

I personally thank profusely the people at The Melsonian Arts Council for having created this wonderful and NUMINOUS piece of RPG creativity, and have fond memories of it after all these years due to it being the most pleasant surprise of a gift by a loved one ...
The first time the core book landed physically in my hands it was, and still is, a beautiful moment I will treasure forever.

I also want to thank my players, who being who they were and still are have endured with me through all the decades from exile, having left
our own country to spread all over the world yet still remember our wonderful and very young years at my basement having fun rolling dice 
every single time we gather in discord and roll20:

David :  The most awesome (and healthy) member of the Eternal Society of Meat Eaters
Osled:   The Greatest and most Sorrowful yet optimist Ardent Giant of Corda (always with you my brother)
Tank!:   A very merry Sorcerer of the College of Friends with the ability to "roach" anyone that irks him
Victor:  A most intriguing and close minded Red Priest with a strange and almost heretical lust for magic scrolls 

To you my friends, for always being there and being the main reason for me creating this :) Love to you my virtual family.

---------------------------
Small note:

Please go make fun and pleasant memories with this game, visit the creators and buy all of their stuff! They deserve it! 

Visit them here: https://www.melsonia.com/

-------------------------------------------------------------------------------------------------------------------------------
---############---------#########+-----------#########----------#####---------=####=-####----------+########-----------####----
---############---------#####*####%---------###########---------#####---------*####*=####---------###########---------=####----
---###--##=-###---------#####=####=---------####=-#####---------#####---------*####=#####---------#####-+####---------=####----
---####+###=###---------#########-----------#####-#####---------#####---------*##########---------###########---------=####----
---###-####+=##---------####+-*####---------#####--####---------#####---------*####-=####---------#####--####------------------
---#-*#######-#---------#####=+####---------###########---------#####---------*#####-####---------#####-#####---------=####----
----##########----------#####-=####----------#########----------#####---------=####+-####---------+####-#####---------=###%----
-------------------------------------------------------------------------------------------------------------------------------


*********************************************************************
Developed for the Roll20 platform with love by yours truly Brujoloco. 
Contributions and feedback are alwaus welcome papis! <3
