import { useState, useEffect, useRef } from "react";

const initTimer = { //initial value of ref
    lastSavedElapsedTime: 0,
    elapsedTime:  0,
    intervalId: null as ReturnType<typeof setInterval> | null,
    start: 0,
    manuallyPaused: false
}
interface OPTIONS {
    updateFrequency?: number,
    maximumValue?:number,
    callback?:(()=>void)
    LocalStorageItemName?:string
}
const defaultOptions:OPTIONS = {

    updateFrequency: 1,
    maximumValue:0,
    callback:undefined,
    LocalStorageItemName:'Persistant_timer'
}
const usePersistantTimer = (
    pauseOnNoFocus: boolean = true, {
    updateFrequency = 1,
    maximumValue = 0,
    callback,
    LocalStorageItemName= 'Persistant_timer'}:OPTIONS = defaultOptions
): [number, () => void, () => void, () => void] => {
    const timer = useRef(initTimer)
    const cu = timer.current
    const getValueFromLocalStorage = () => {
        let v = parseInt(localStorage.getItem(LocalStorageItemName) || '0')
        if (isNaN(v) || v < 0) v = 0
        cu.lastSavedElapsedTime = v
        cu.elapsedTime = 0
        cu.start = new Date().getTime()
    }
    const [elapsedTime, setElapsedTime] = useState(cu.lastSavedElapsedTime)

    const PIN = (i: number) => { // set parameter to default 1 if the paramenter is not legal number.
        return (i > 1 && Number.isInteger(i)) ? i : 1
    }
    const updateFrequnce = PIN(updateFrequency)
    const start = () => {
        if (cu.manuallyPaused) cu.manuallyPaused = false
        if (!cu.intervalId) {
            getValueFromLocalStorage()
            cu.intervalId = setInterval(() => {
                cu.elapsedTime = new Date().getTime() - cu.start + cu.lastSavedElapsedTime
                //t preserve real elapsed time. 

                if (!(cu.elapsedTime % updateFrequnce)) setElapsedTime(cu.elapsedTime)

                if (maximumValue && cu.elapsedTime >= maximumValue * 1000) {
                    if (callback) callback()
                    cu.elapsedTime = 0
                    cu.manuallyPaused = true
                    pause()
                }
                localStorage.setItem(LocalStorageItemName, cu.elapsedTime.toString())
            }, 1000)
        }
    }
    const pause = () => {
        cu.lastSavedElapsedTime = cu.elapsedTime
        if (cu.intervalId) {
            clearInterval(cu.intervalId)
            cu.intervalId = null
        }
    }
    const manuallyPause = () => {
        cu.manuallyPaused = true
        pause()
    }
    const resetTimer = () => {
        cu.lastSavedElapsedTime = 0
        cu.elapsedTime = 0
        localStorage.setItem(LocalStorageItemName, "0")
        cu.start = new Date().getTime()
        setElapsedTime(0)
    }

    useEffect(() => {
        getValueFromLocalStorage()
        window.onblur = () => {
            if (pauseOnNoFocus) pause()
        }

        window.onfocus = () => {
            if (cu.manuallyPaused) return
            if (pauseOnNoFocus) start()
        }

        start()

        return () => {
            if (cu.intervalId) {
                clearInterval(cu.intervalId)
                cu.intervalId = null
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pauseOnNoFocus, LocalStorageItemName, maximumValue, callback, updateFrequency])

    return [elapsedTime, start, manuallyPause, resetTimer]
}

export default usePersistantTimer