# Client side persistant timer 

This small react hook can be easily used to implement a timer as well as a **countdown timer**. 
This timer use localstorage to save the data, so it can permeanatly stay in a browser unless user delete it.
It can be used to know how long user has viewed a webpage( timer will defaultly pause if the webpage lost focus, such as switch to another tab or switch to another app, you can override with parameters )

## How to use:
you can simply use like this:

  `const [count,start,pause,reset] = usePersistantTimer()` default parameters

  or

  `const [count,start,pause,reset] = usePersistantTimer(false,{updateFrequency:10})` set pauseOnNoFocus false and set the update frequency of return varaible 'count' to 10s, default is 1s.


## Parameter
`pauseOnNoFocus: boolean, define if timer will pause if the page lost focus`
`options:{`
    `updateFrequency?: number, ` define how often return value will be updated, unit: s, default:1
    `maximumValue?:number,` define the limit the timer can reach, unit: s, default:0 means no limit
    `callback?:(()=>void),` the callback will be called when maximumValue is reached. 
    `LocalStorageItemName?:string` the name of the item stored in a browser's local storage
}

* Please note all timer share only one storage, so if user open the same webpage in multiple tabs. All timer will be same.