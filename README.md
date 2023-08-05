Hi there! So you're going to first want to run npm install, and then run npm start, in the main directory. 

Then, you're going to want to go into the 'server' directory and run 'python3 app.py'. 

But ahhh... before you do any of this, you're going to want to pick yourself up an ESP-32 AI-Thinker (preferably) or literally any other video and wifi capable microcontroller. Ah... I can save you some trouble -- you're really going to want to use that ESP-32. Yeah! Because it's like $4. Cool. 

So, get your board, download the Arduino IDE, and search for the ESP-32 board manager url. Actually, you know what? 

Here it is: https://raw.githubusercontent.com/espressif/arduino-esp32/gh-pages/package_esp32_index.json

Yeah! So go to settings or preferences and add that into 'additional board managers'. Cool. Now, go to libraries and search 'esp32'. Download the first official thing that pops up. Awesome! 

Now we have a BUNCH of esp32 stuff! Cool! So go to examples now and, under esp32, click camera webserver or video web server. 

Set your wifi name and password (your home wifi...) and then plug in that ESP-32 to your computer, select ESP-32 AI Thinker as your board, select the port that shows up, and upload your sketch. If no port is showing up, you probably have a crummy microusb cable. 

Great! So once you're done with that, go to your Arduino IDE Serial Monitor and set a baud rate of 115200. That'll tell you your web server url. Great. Plug that into the code instead of mine. Awesome. 

