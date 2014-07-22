#A Nifty Watcher
This is a node file watcher that watches files in its root folder. A changed file will be updated live via websocket and displayed in the browser.

#How to use
1. Clone this repo
2. `cd` into the root directory and do `npm install`
3. To run, use `node app.js`, this will watch every file in app.js current root folder
4.  Open a browser, go to your ip address, port 1234. You can look at your ip address by typing `/sbin/ifconfig` in your terminal.  Go to your browser and type, for example: `http://192.168.1.245:1234`
5. Try changing a file.  For example, change file1.txt
6. See it updates real time over the browser

###Technologies
####JavaScript
* jQuery
* Socket.io ==> to push realtime update

##### Node
* Express
* Morgan
* Escape-html
* Async
* Ejs
* Socket.io

####HTML 5

####CSS 3
* Bootstrap

##Known Bug
This watcher is not recursive.  Meaning, it will not watch files inside subfolders.

##Features to add in the future
* Integrate JSDiff (https://github.com/kpdecker/jsdiff) to show changes instead of just refresh the page
* Use the ACE (http://ace.c9.io/#nav=about) editor to show the code with highlighting instead of just in pre tags
