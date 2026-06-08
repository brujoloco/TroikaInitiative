# **TroikaInitiative**
A Roll20 Script to handle the amazing and ultra-random **Troika! RPG** Initiative System

---

## 🌟 **Overview**

**TroikaInitiative** is a custom **API script** for Roll20, designed to track initiative in the **Troika! RPG**.

When I created this API script, I originally decided to use it for personal use, but after several iterations (hence the late version number), I decided to simply throw it into my Git and see if I could be bothered to upload it to Roll20.

This script was built to automate the card-drawing mechanics of the game, streamline combat organization, and ensure a smooth play experience. I personally love face-to-face playthroughs using a custom printed deck of cards, but I found it challenging to do the same in Roll20. Thus, this script was born! 🎴 😊

---

### **Key Features**

---

### 🎴 **Customizable Decks**
- Automatically adds cards for players (2 each by default) and a shared monster pool.
- Includes the **"End of Round"** card to denote the end of a combat phase.

### 🧙 **Combatant Management**
- Add tokens directly from the map or manually with `!troika` commands.
- Toggle roles between "player" and "monster."
- Adjust or remove combatants on-the-fly.

### ⚙️ **Responsive Commands**
- Draw cards one at a time, with **alerts** for player and monster turns.
- Clear combatants and end combat when required.
- Inspect the deck status or reshuffle it at any time.

### 🎨 **Immersive Roll20 Integration**
- **Visually styled messages** for clarity and immersion.
- Differentiated visuals for **player actions**, **monster actions**, and **system messages**.

---

## ✅ **Requirements**
- **Roll20 Pro Subscription** (API scripting functionality is required.)

---

## 🚀 **Installation**

1. **Go to your Roll20 game.**
2. In **Game Settings**, enable the **API Scripts** tab (Pro users only).
3. Upload the `TroikaInitiative.js` file or paste the script into a new API script file.
4. Save the script—this will automatically initialize it in your game.
5. Once loaded, a **confirmation message** will appear in the Roll20 chat.

⚠️ **Note**: This step may eventually be unnecessary if I choose to clone the Roll20 repo and perform the full API upload.

---

## 🕹️ **Usage Instructions**

### 🎲 **General Command Overview**

| **Command**                | **Description**                                                                 |
|----------------------------|-------------------------------------------------------------------------------|
| `!troika start`            | Starts combat setup with the selected tokens.                                |
| `!troika show`             | Re-displays the setup menu.                                                  |
| `!troika addtoken`         | Adds selected tokens as combatants.                                          |
| `!troika addmanual <name>` | Adds a manual combatant (e.g., `!troika addmanual Goblin monster 4`).         |
| `!troika confirm`          | Finalizes the deck and starts combat.                                        |
| `!troika draw`             | Draws the next card in the deck.                                             |
| `!troika status`           | Displays the current deck's status.                                          |
| `!troika reshuffle`        | Reshuffles the deck, including all cards.                                    |
| `!troika remove <name>`    | Removes a combatant by name (e.g., `!troika remove Goblin`).                 |
| `!troika end`              | Ends combat and clears the initiative deck.                                  |
| `!troika help`             | Displays a **detailed help menu** with all commands.                        |

---

## ⚔️ **Combat Workflow**

### **1. Set Up**
- Select all tokens representing combatants on the Roll20 map.
- Run `!troika start`. This will open the **setup menu** for the GM.
- Adjust combatants:
  - Toggle roles between **Player/Monster**.
  - Update card counts as needed.
  - Add additional tokens with `!troika addtoken` or manually with `!troika addmanual`.

---

### **2. Initiate Combat**
- Finalize and confirm the setup with `!troika confirm`.
- The **initiative deck** is built, and a summary is shown in the chat.
- Players and GMs can then draw cards using `!troika draw`.

---

### **3. During Combat**
- As cards are drawn:
  - Players and monsters are **prompted to act**.
  - The **"End of Round"** card indicates when the round is over.
- Check the status of the deck at any time via `!troika status`.

---

### **4. Manage Combat**
- Add or remove combatants mid-combat using:
  - `!troika addmanual`
  - `!troika remove`
- Reshuffle the deck with `!troika reshuffle`.
- End combat and clear data with `!troika end`.

---

## 💻 **Development Details**

### **File Structure**
- Built with a **modular and maintainable structure**.
- Modular functions handle:
  - **Deck Management** (shuffling, drawing, reshuffling).
  - **Combatant Management** (adding, removing, updating).
  - **Chat Output** (styled for clarity and immersion).

---

### **Key Variables**
- `state[TroikaInitiative]`: Stores the current state (combatants, deck, and mode: setup or edit).
- `COLORS`: Defines the **color scheme** for styled chat messages.

---

### ⚙️ **Customization**
1. **Modify styles** by updating the `COLORS` object in the script.
2. Adjust **default card counts** for players or monsters in the `buildDeck` or `cmdSetCards` functions.

---

### 🕵️ **Logging**
- Key events such as reshuffles and participant updates are logged via `log()` for debugging.

---

## ❗ **Known Issues**
- Combatants without tokens must be added **manually** (assign appropriate roles and card counts).
- **Only GMs** can execute commands; players rely on GM-provided commands.

---

## 🔮 **Acknowledgments**

This script was inspired by the rules and mechanics of **Troika!**, preserving its creativity and dynamic flair.

### **Special Thanks**:
I want to express my gratitude to **The Melsonian Arts Council** for creating such a beautiful and numinous piece of RPG creativity.  
This game was a gift from a loved one, and the physical book remains a treasured memory.

---

### **To my players**: 💛
This script would never have existed without you:

- **David**: The most awesome member of the *Sublime Society of Beef Steaks*
- **Osled**: The *optimist Ardent Giant of Corda*—always with you, my brother.
- **Tank!**: A cheerful *Sorcerer of the College of Friends* who can "roach" those that irk him.
- **Victor**: Our *close-minded Red Priest* with an intense desire for scrolls! 

To all of you—thank you. You are the reason behind this script. Love to my virtual family.

---

## 📣 **Final Notes**
**Make fun and pleasant memories** with this game, and support its creators!  
**Visit the Melsonian Arts Council here**: [Melsonian Arts Council](https://www.melsonia.com/)

---
```text
-----------------------------------------------------------------------------------------------------------------          
---##########---------#######=----------+######=---------####---------####-=###----------######+----------###----          
---##########--------=#########--------#########*--------####*--------####-%###---------#########--------+###----          
---##--##--##--------=###=-####--------###*-#####--------####*--------####-%###--------=###--####--------+###----          
---###-##-###--------=########---------####=#####--------####*--------########---------=#########--------+###----          
---##*####=##--------=########+--------####=#####--------####*--------#########=-------=#########--------+###----          
---##=####*=#--------=###*-####--------#####-####--------####*--------####-####--------=###+-####----------------          
----+######*---------=####-####--------##########--------####*--------####-####--------=####-####--------+###----          
----########----------####-*###---------*######+---------####=--------####--###---------###+-####--------=###----          
-----------------------------------------------------------------------------------------------------------------          

```

*********************************************************************
Developed for the Roll20 platform with love by *yours truly* Brujoloco.  
Contributions and feedback are always welcome! ❤️  
*********************************************************************
