### Core

### Installation
Requires 

```npm install gulp -g```

```npm install dolphin-cli -g```

Run

`dolphin-cli init -t develop test-project`

`cd test-project && npm install && gulp`

You will get the following structure:


    packages
    ---- some package 1
    ---- some package 2
    gulpfile.js    
    
### Package structure    

**Server**

Packages are registered in the **module.js**
Create a file **package.json**

All of the Server side code resides in the `/server` directory.

    Server
    --- acl           # Configuration file of acl
    --- controllers   # Server side logic goes here
    --- models        # Database Schema Models
    --- model_ext     # Extensions for Schema Models
    --- routes        # Rest api endpoints for routing
    --- views         # Swig based html rendering

**Client**

All of the Client side code resides in the `/public` directory.

    public            
    --- assets        # JavaScript/CSS/Images (not aggregated)
    --- controllers   # Angular controllers
    --- config        # Contains routing files
    --- services      # Angular services (also directive and filter folders)
    --- views         # Angular views


By default you will get these modules:

* dolphin-core

* [dolphin-core-modules] (https://github.com/knodeit/dolphin-core-modules)

* [dolphin-core-utils] (https://github.com/knodeit/dolphin-core-utils)

* [dolphin-lib] (https://github.com/knodeit/dolphin-lib)

* [dolphin-logger] (https://github.com/knodeit/dolphin-logger)

* [dolphin-cli] (https://github.com/knodeit/dolphin-cli)

* [dolphin-angularjs-modules] (https://github.com/knodeit/dolphin-angularjs-package)

* [dolphin-asset-manager-modules] (https://github.com/knodeit/dolphin-asset-manager-package)

* [dolphin-html-render-modules] (https://github.com/knodeit/dolphin-html-render-package)

* [dolphin-mongoose-modules] (https://github.com/knodeit/dolphin-mongoose-package)

* [dolphin-server-web-modules] (https://github.com/knodeit/dolphin-server-web-package)

* [dolphin-acl-web-modules] (https://github.com/knodeit/dolphin-acl-web-package)


**Notice**
The package structure can be anything, only require module.js and package.json in folder. But if you use some plugins you have to follow their WIKI. 



        
### How to create a package

1) Create a folder in packages

2) Create a file module.js

3) Create a file package.json


The content of module can be like this:


```javascript

var Module = require('dolphin-core-modules').Module;
var test = new Module('Test', __dirname);

//registration factory also initialization
test.addFactory('Configuration',function () {
    return {
      a:1 // can be override from another module
    }
});

//configuration other factories 
test.configureFactories(function (MongooseConfigurationFactory, WebServerConfigurationFactory, HtmlRenderConfigurationFactory, AngularJsConfigurationFactory, AclManagerConfigurationFactory) {
    
    //module has mongoose models
    MongooseConfigurationFactory.addModule(test);
    
    //module has routes, can be api etc
    WebServerConfigurationFactory.addModule(test);
    
    //module will have acl logic
    AclManagerConfigurationFactory.addModule(test);
    
    //module has views to render to client
    HtmlRenderConfigurationFactory.addModule(test);
    
    //module as angular module
    AngularJsConfigurationFactory.addModule('test', test);
    
});


test.run(function(TestConfigurationFactory, /* any factories, etc*/){
    //here you will get the last version of any factories
    
    //execute your logic
});
```


### Resolve objects

You can get any factories or modules everywhere.

```javascript
var dolphin = require('dolphin-core');
dolphin.resolveObjects(function(TestConfigurationFactory, Mongoose /* etc*/){
   //here you can use them
});
```

