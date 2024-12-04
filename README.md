[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/ATV5e7Id)

#Geogame website
https://gmt-458-web-gis.github.io/geogame-hdrklc/
# Geo-Guess Game

## Design of the Geo-Game 

### Requirements
1. **Map Display**: A world map where a random marker is placed.
2. **User Interaction**: User guesses the country or ocean, submits the guess.
3. **Feedback**: Shows correct/incorrect feedback and displays information about the location.
4. **Scoring System**: Points awarded based on correct guesses and response time.
5. **Restart Option**: Allows restarting the game.

### Frontend Layout
- **Header**: Game title.
- **Map Area**: Displays the world map with a random marker.
- **Score Panel**: Displays the player’s current score.
- **Guess Input**: Field to enter guesses.
- **Feedback Popup**: Shows if the guess was correct or incorrect.
- **Info Popup**: Provides additional information about the location.
- **Restart Button**: Resets the game.

### JavaScript Library Used
- **OpenLayers**: For rendering and interacting with the map.

 -------------------------------------------------------
|               Header: "Geo-Guess Game"               |
 -------------------------------------------------------
|   Map Area (world map with random marker placement)  |
|------------------------------------------------------|
|                  Score Display Panel                 |
 -------------------------------------------------------
|  Guess Input [__________]  Submit Button             |
 -------------------------------------------------------
|  [ Result Popup for Correct/Incorrect Feedback ]     |
 -------------------------------------------------------
|  [ Info Popup for Additional Information ]           |
 -------------------------------------------------------
|                  Restart Button                      |
 -------------------------------------------------------


# GeoGuessr Game: Drag and Drop to Find the Country 🌍

GeoGuessr Game is a fun and educational game where you try to locate the correct country on the map by dragging and dropping a marker. Test your geographical knowledge while having a great time!

---

## 📖 How to Play?

### 1. Learn the Target Country
The name of the target country is displayed in the **"Current Target"** section of the scoreboard. Your goal is to locate this country.

### 2. Drag the Marker
Drag the red marker, which is located in the center of the map, using your mouse and move it to the borders of the target country.

### 3. Submit Your Guess
After placing the marker on the target country, click the **"Submit"** button to make your guess.

### 4. See the Result
- **Correct Guess**: A "Correct!" notification will appear in a green box, and you will earn 10 points.
- **Wrong Guess**: A "Wrong!" notification will appear in a red box with the correct country name. The game will reset.

### 5. Collect Your Score
- Earn **10 points** for each correct guess.
- If you make a wrong guess, your score will reset to zero.

---

## 🛠️ Technologies Used

- **HTML/CSS**: For page layout and styling.
- **JavaScript**: For game logic and map controls.
- **OpenLayers**: For map functionality and draggable marker.

---

## 🎮 Have Fun!

Enjoy the game and improve your geographical knowledge while competing for the highest score! 🎮 🌍
