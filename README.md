# builderbot-whatsapp-chatbot-IITA
This a whatsapp chatbot made with builderbot (https://www.builderbot.app/en) 

As we can see in the page we have to install npm (or pnpm) to run the installation command ([p]npm create builderbot@latest). This command will install all the dependencies and extensions that we need for later.
Running this command will deploy a little menu to modify our installation. I chose the following: base, typescript, baileys, memory.

The main file is located in /src/ it is app.ts. I's here where our program is located. If we want to modify the behaviour of our bot.
(In the git there are a bunch of files in /src/, they are some versions of my bot. Some of them are not running.
If you want to run the bot from other file you have to modify the 'package.json' file located in the main directory.

For running just open the console, locate the main directory and run the following command: "npm run dev" as admin. for windows or "sudo npm rnu dev" for linux.

I've only uploaded the main programs so if you want to install it must run the npm command.

The latest file is "app-07-03.ts" from /src/, it have some issues. Must introduce IA for this bot because of the various questions of the clients. It's hard to manage so much questions with only menues.  

For using the same must:
1. Run "npm create builderbot@latest".
2. copy the .ts files in the /src directory.
3. Change the "package.json" file for the correspondent name of the file OR change the file name to "app.ts"
4. cd main directory & "npm run dev" as admin. for windows or "sudo npm rnu dev" for linux.
