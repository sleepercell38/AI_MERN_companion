import { WebContainer } from '@webcontainer/api';

// Call only once
let webcontainerInstance = null

export const getwebcontainer= async ()=>{
    if(webcontainerInstance===null){
        webcontainerInstance= await WebContainer.boot();
    }
    return webcontainerInstance;
}

