# Indebox
A middle hand between InDesign and Dropbox to make them work together so that you can work your magic.

## Table of index
- The issue
- The solution
  - How it works
- Download and instructions
  - Requirements
- Contribute
- Code introduction
  - The tools
  - The file structure
  - Webpack/Babel
  - The source code
- The `.idlk`-files
- Rest Api
- Disclaimer

## The issue
At our company we recently started using Dropbox for Business as our cloud-server solution. It's really great! But we have one problem.
We create a monthly magazine, and therefore we do a lot of work in Adobe InDesign, also a great tool. And when you open an InDesign-file (`.indd`) it creates a sort of lock-file (`.idlk`). This file is read by InDesign and will prevent anyone else from opening the file and create havoc.
But even though this file is synced with Dropbox, something disappears during it's trip from one computer, via the cloud and down to another computer. InDesign ignores the lock-file and opens the document anyway, **and the disaster is a fact**. Data might be lost on either one or both of the computers. This is not good.

## The solution
Hopefully InDesign and Dropbox will bang their heads together and come up with a solution soon. But we're not there yet. Therefore, without further ado – i give you **Indebox**.

Indebox works as a sort of middlehand, or middleware, in between Dropbox and InDesign. All you have to do is to open the `.indd`-files in your Dropbox-directory (or anywhere else actually) with Indebox instead of InDesign.

### How it works
Indebox is a normal app, you put it in your Applications-folder on your computer and use it to open `.indd`-files (se more detailed instructions below).
Indebox will do it's work silently and you will not notice it. But under the hood it actually does a hard check to see if any `.idlk`-files are present in the same directory as the document. If so the document won't open and a disaster is prevented.
But on the other hand, if there are no `.idlk`-files present the file will open as usual with InDesign and you can work your magic.

## Download and instructions
1. Download the [Indebox-app](https://adambrgmn.github.io/indebox), that's a good start.
2. But the app in your Applications-folder
3. I recommend you to also set Indebox as the default app for opening `.indd`-files.
3.1. In Finder, go to any directory containing a InDesign-file
3.2. Right-click on it and choose Show info
3.3. Under Open with choose Indebox (you might have to find it your self if Finder the system doesn't do it for you.
3.4. And before you leave, don't forget to click Change all.

Now all your `.indd`-files will open with Indebox and hopefully you won't encounter any disasters.

### Requirements
- OS X El Capitan 10.11.4 (It will probably work for earlier versions as well)
- Adobe InDesign CC 2015 (this one is important, in the future i will try to make it work with other versions of InDesign as well)

## Contribute
This is a project that evolved from a need at the company I'm currently working on. A need to be able to co-operate with InDesign-documents synced over Dropbox.

The app works. It does its job and we are satisfied.

But I do think that this can be done in other ways to, probably better ways – therefore I would love it if you would like to contribute. Just make a pull-request or open an issue!

```bash
$ git clone git@github.com:adambrgmn/indebox.git
```

I won't accept any pull-requests to master. Instead I recommend you to work on your own branch and when you're ready, merge it into develop-branch (I use [Git Flow](https://github.com/nvie/gitflow), I recommend you to do the same!).

## Code introduction
So you are interested in contributing or would like to make it your own (I don't have any problems with that, just give me some credit, will you :smirk:)

First off, you need to have [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Node.js](https://nodejs.org/en/) and NPM (comes with Node.js) installed.

When that's done, clone the repo and install all dependencies.

```bash
$ git clone git@github.com:adambrgmn/indebox.git
$ cd indebox
$ npm install
```

*(If you don't understand what the lines above means – do some reading about the command line and Terminal.)*

The app is a small so called *applet*. It's written in [JavaScript for Automation](https://developer.apple.com/library/mac/releasenotes/InterapplicationCommunication/RN-JavaScriptForAutomation/Articles/Introduction.html) (JXA), a language developed by Apple for you to be able to make small apps written in JavaScript.

The api differs in a some ways from the normal JavaScript in the browser or on the server. Therefore I recommend you to read a little about it, the [JXA Cookbook](https://github.com/dtinth/JXA-Cookbook) is a good start.

### The tools
The app is written in JavaScript, more specific the latest on – *ES2015*, or ES6 if you like. The code is then transformed by *Babel* using *Webpack*. Almost as trendy as one can be in 2016.

NPM is used as a task-runner to bind all this together.

```bash
$ npm start # Will run Webpack and watch for changes in your code
$ npm test # Will test your code with osascript, practically the same as copy/paste the code into Script Editor.app and hit Run
$ npm run build # Will compile a minified version of the app, and then build the Indebox.app and copy all essential files into it (icons and Info.plist)
```

And once again, I recommend you to get to know your tools a little before you start doing any changes. Running things as described above won't crash your system but you might crash the app if you do something different.

### The file structure
```
├── dist              # Contains Indebox.app (after you run 'npm run build')
├── icons             # All the iconsets
│   └─ src            # The .icns-files (after you run 'npm run build')
├── node_modules      # Contains all dependencies
├── plugins           # Plugins for Webpack
├── src               # Source-files, in short The App
├── templates         # Templates for different files
├── .babelrc          # Babel configuration file
├── .eslint           # ESlint configuration file
├── .gitignore        # Ignored files and folders
├── package.json      # Project description and dependencies
├── webpack.config.js # Webpack configuration file
```

### Webpack/Babel
First, read about [Webpack](https://webpack.github.io/) and [Babel](https://babeljs.io/), so that you know what it does.
This project uses Webpack to compile all js-files in `src` to one unified `app.js`-file that we then can build Indebox.app from.

In short Webpack goes into the entry `src/index.js` and brings in all of its dependencies, both node_modules and private. It then transform them from ES2015 to ES5 using Babel.

After that it adds some lines of code (JxaPlugin) before and after the main code. This code is necessary for it to work with JXA.

### The source code
I want to give you a short introduction to how this app works and cover the four most important files.

The story begins with one small file called `index.js`.

#### Index
```javascript
// src/index.js

import File from './File';
import processFile from './process-file';

window.run = () => {
  const file = new File();
  processFile(file);
};

window.openDocuments = (docs) => {
  for (const item of docs) {
    const file = new File(item);
    processFile(file);
  }
};
```

It doesn't look much for the world, but it's the backbone of this application. The imports will come later. First we will talk about `run()`.

This function is called if you double-click on Indebox.app (or single-click if it's in your dock). It will create a new file from the file you have created and then process that file to see  if it's good to go, or not. As simple as that.

`openDocuments()` is called if you double-click on one or many `.indd`-files in your system. It will iterate over each one of them (docs is an array containing them all) and do the same process as earlier.

#### File
Let's take a look att File.
```javascript
// src/File/index.js

import { systemEvents } from '../system';
import { changeFileUser, fileData } from '../api';
import chooseFile from '../chooseFile';
import config from '../config';

export default class File {
  constructor(item) {
    this._choosenFile = !item ? chooseFile() : item;
    this._alias = systemEvents.aliases.byName(this._choosenFile.toString());
    this._fileData = config.rest ? fileData(this.name) : null;
  }

  get choosenFile() {
    return this._choosenFile;
  }

  get name() {
    const filename = this._alias.name().split('.');
    filename.pop();

    return filename.join();
  }

  get path() {
    return this._alias.container().posixPath();
  }

  get folder() {
    return systemEvents.folders.byName(this.path).diskItems.name();
  }

  get extension() {
    return this._alias.nameExtension();
  }

  get user() {
    if (this._fileData) {
      return this._fileData.username;
    }

    return null;
  }

  get recentlyOpened() {
    if (this._fileData) {
      const lastOpened = this._fileData.date;
      const now = Date.now();
      const timeFromNow = now - lastOpened;

      return timeFromNow < 10000;
    }

    return null;
  }

  changeUser() {
    changeFileUser(this.name);
  }
}
```

That's a bit heavier to comprehend i guess. File is actually a class. Classes are some syntactical sugar added with ES2015. The constructor takes one argument, an item, or actually a file. If it's not defined the constructor will nicely ask you to select a file.

After the construction-function you can see a whole lot of get-functions. These a utilized in the app and are quite self explanatory. Mainly it returns a corresponding value.

The last three functions (`get user()`, `get recentlyOpened()` and `changeUser()` might baffle you. To give you a hint they are awesome. To read more about them check out the rest api-section.

#### Process File
This function is also part of the backbone of this app. It processes each file to see if there might be any trouble opening the file or not.

```javascript
// src/process-file/index.js

import { app } from '../system';
import match from '../match';
import notify from '../notify';
import config from '../config';

export default function processFile(file) {
  match(file, (obj) => {
    app.open(obj.choosenFile);
    app.activate();

    if (config.rest) obj.changeUser();
  }, (err) => {
    notify(err);
  });
}
```

`processFile()` takes one argument, a file. This file is then matched against different types of arguments to see if its possible to open the file or not. If not it will open it with InDesign. Otherwise it will send a notification telling you why it can't be opened.

`match()` is the function that does these checks. It takes three arguments:

- `file`: The file-object
- `resolve`: A callback that gets fired if everything is alright
- `reject`: A callback that get fired if there are som problems

#### Config
`config.js` is where you can make some tweaks to make the app fit your needs.

```javascript
// src/config.js

const config = {
  stdApp: 'Adobe InDesign CC 2015',
  dropboxName: 'Dropbox',
  stdPath: 'path/to/default/folder',
  stdFileTypes: ['dyn.ah62d4rv4ge80w5xequ'],
  stdFileEnding: 'indd',
  rest: false,
  restUrl: '',
  errors: {
    fileTypeError: {
      title: 'An error occured',
      message: 'The filetype "[extension]" is not supported',
    },
    matchError: {
      title: 'InDeBox',
      message: '[name].[extension] is used',
    },
  },
};

// (...)

export default config;
```

The config-file is mainly an object containing som keys and some properties.
- `stdApp`: The full name of the the InDesign app, change this when InDesign updates to other version.
- `dropboxName`: The name of your Dropbox-directory. If you're only using a personal account it will probably just be called "Dropbox". But if you are using a Business-account it will be called "Dropbox (<company name>)".
- `stdPath`: If you have all your files in on directory inside Dropbox you can make the app always open inside that directory by defining a path to it. Remember that it's relative to the Dropbox-directory. `E.g. Customers/Projects`
- `stdFileTypes`: File identifier for `.indd`-files. It might update when InDesign updates. If so, change it.
- `stdFileEnding`: The file-endings that the app can process, probably just 'indd'.
- `rest`: This one i exciting. You can hook your app up against a rest api and get some extras. Read more down below.
- `restUrl`: Same as above.
- `errors`: Messages and titles related to different types of errors for you to maybe make more personal, or translate if you like.
-- `messages`: In the messages you can use som variables that will change to the correct value. The ones available are:
--- `[name]`: The filename, without extension
--- `[extension]`: The file extension
--- `[user]`: The one who uses the document (only available if the rest api is enabled.

Use `if (process.env.NODE_ENV !== 'production')`to make different changes during production. Say you're developing at home without InDesign installed. Then you can change the standard application to Preview.

#### The rest of the files
The code should be properly commented for you to understand how it all works. But if you have any questions or notice any bugs open an [issue](https://github.com/adambrgmn/indebox/issues).

## The `.idlk`-files
### How InDesign handles this
I thing we need to talk a little about InDesigns so-called lock-files.

As I described earlier, once you open a document with InDesign it will create a `.idlk`-file in the same directory as your document. You can see it pop up in Finder. But to be honest I don't know how it really works, I can only presume.

The file is always 0K, which means it's empty. No data, nothing. But what I have noticed, and what I guess is the only difference  has to do with ownership.

I can illustrate this for you.

First open your document with InDesign. Then, with the Terminal, go to that folder and list all files.

```bash
$ cd project/folder
$ ls -la # The -la gives you a little bit more to work with
total 1920
drwxr-xr-x  4 adam  staff     136 25 Apr 15:46 .
drwx------+ 4 adam  staff     136 25 Apr 15:46 ..
-rw-r--r--@ 1 adam  staff  983040 25 Apr 15:46 my-document.indd
-rw-r--r--@ 1 adam  staff       0 25 Apr 15:46 ~my-document~-5oow5.idlk
```

The interesting part here is the two lines in the bottom. It's my document and the corresponding `.idlk`-file, because its open. And as you see my name is present there as well.

In our old system we used a physical server here at our office. And if I do the same check in that folder on the server the owner of the file is still `adam`. But if I instead do the same procedure but in my Dropbox-folder and take a look at the folder from my collegues computer something is different.

```bash
...
-rw-r--r--@ 1 collegue  staff  983040 25 Apr 15:46 my-document.indd
-rw-r--r--@ 1 collegue  staff       0 25 Apr 15:46 ~my-document~-5oow5.idlk
```

This is because Dropbox creates new files on every computer that syncs with it, and then the owner of the files will always be the one using the computer. This is normally no problem, but the issues arise when the ownership is important.

My guess then.

I believe that when InDesign opens a document it checks for any presence of a corresponding `.idlk`-file. It it's there InDesign will see who's the owner of that file. If the owner is someone else than the one trying to open the file it means that someone else is using it somewhere else. And InDesign will prevent you from opening.

But in the case of Dropbox + InDesign the `.idlk`-files, and all other files, will always be owned by you. And InDesign can't see that there is any problem for you to open it. And once again – disaster.

### How Indebox handles this
Indebox ignores the fact that someone can own a file or not. Cause the fact is that if a corresponding `.idlk`-file exists the document is open and you should not open it. And if you yourself has it open you can just click on the InDesign-icon in the dock and continue with your life.

As easy as that.

## REST API
Already plugged in to the app is the option to connect it to a rest api. This will give you some extra features:

- See who uses the file
- Account for same time opening

```javascript
// src/api/index.js

import { currentApp } from '../system';
import { username } from '../user';
import config from '../config';

function curl(filename, params) {
  let put;
  const url = `${config.restUrl}/${filename}.json`;

  if (params) {
    put = `-X PUT -d '${JSON.stringify(params)}'`;
  }

  const shellScript = `curl ${put} '${url}'`;

  try {
    return currentApp.doShellScript(shellScript);
  } catch (err) {
    return false;
  }
}

export function changeFileUser(filename) {
  const params = {
    date: Date.now(),
    username,
  };

  return curl(filename, params);
}

export function fileData(filename) {
  return curl(filename);
}
```

It's quite simple actually (as many other things in this app). The api has two public functions `changeUser(filename)` and `fileData(filename)`.

### The functions
`fileData()` accepts one argument, the filename (which you can fetch if you call `file.name`, assuming that file is an instance of the file class).

It utilizes the `curl`-function to get json-data from the api and returns the data as an object.

`changeFileUser()` also accepts one argument, the filename (which you can fetch if you call `file.name`, assuming that file is an instance of the file class).

It utilizes the `curl`-function and puts the data via the api. The data provided is the current user and the time in unix milliseconds.

### The settings
To enable this feature you need to do two things – change the settings and get hold of an api.

The first one is simple:

```javascript
// src/config.js
const config = {
  (...)
  rest: true // change it to true
  restUrl: https://yourresturl.com/
  (...)
};
```

Now the app will try to make api calls everytime you open it (don't worry, it wont crash if you loose internet connection or if anything is wrong, it can handle these errors).

The hard part is to choose a rest api. I recommend the easy way: [Firebase](https://www.firebase.com/).

### Firebase api
Go to Firebase and set up free account. If run a small business it might be enough with the free choice, if you're bigger it might cost a little depending on how many api calls you do.

Create a new app and copy the new app-url.

```javascript
const config = {
  (...)
  rest: true
  restUrl: 'https://yourappname.firebaseio.com/'
  (...)
};
```

That's it. Now the app will prevent you from opening a file if it was opened the last 10 seconds (to account for sync of the `.idlk`-files). And you can also make use of the new variable `[user]`when composing the error notifications (see more below).

### Your own api
Soon!

### Error notifications
When you connect to a rest api you will have the ability to see who is using a file that you can't open. But in order to make it work you have to tweak the error messages:

```javascript
// src/config.js

(...)

if (config.rest) {
  config.errors.matchError.subtitle = 'The file is used by [user]';
  config.errors.recentlyOpenedError = {
    title: 'InDeBox',
    subtitle: 'The file was opened by [user]',
    message: '[name].[extension] was opened just a few seconds ago',
  };
};
```

## Disclaimer
This project is purely personal and I hope you won't hold me accountable for any harm done.
To put it short: It works for me and I really hope it works for you.