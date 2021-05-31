self.addEventListener('message',(m)=>{
    console.log("producer .js")
    var counter = 0;
    var base = "../sample_videos/container";
    var url = base+counter;
  //  fetchContainers(url);
   
    const producerList  = [];
    // getContainer(url);

    // // maybe we can use some async fetch request here
    // // but now i ll just stay on the worker infrastructure

    // function getContainer(url){
    //     if(counter>300)
    //     return;
      
    //         fetch(url)
    //         .then(response => response.arrayBuffer())
    //         .then(data =>  {  
    //             //todo: add data, returned from fetch, to shared memory 
               
    //            // producerList.push(data);
                
    //            // console.log("data - | ", data);
    //             postMessage(data)
    
    //     });
    //     counter++;
    //     url = base+counter;
    //     getContainer(url);
    //  }


    // async function fetchContainers(url) {
    //     const response = await fetch(url);
    //     // waits until the request completes...
    //     const movies = await response.arrayBuffer();
    //     console.log(movies);
    //     console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    //   }

    // for(var i=0; i<300; i++){
    //     console.log("producer + ", i)
    //     postMessage(i);
    // }

    console.log("before the fetch!!");
    var urls = [];
    for (var i =0; i<100; i++)
    urls.push("../sample_videos/container"+i);

    console.log(urls.length)
    fetchSimultaneously(urls);




async function fetchSimultaneously(urls) {
    console.log("im here")
    startTime = new Date();
const queue = urls;
const maxSimultaneouslyRequests = 20;
let currentRequests = 0;
let i = 0;

return await new Promise(resolve => {
    const result = [];

    const fetcher = setInterval(async () => {
        if (queue.filter(url => url).length === 0) {
            clearInterval(fetcher);
            resolve(result);
        }

        if (currentRequests >= maxSimultaneouslyRequests || i > queue.length - 1) {
            return;
        }

        // Get current index and increase i
        const index = i++;
        const url = queue[index];
        console.log(url);
        currentRequests++;
        // Keep same index as of the passed urls array
        result[index] = await (await fetch(url).then(response => response.blob() ));
      
        currentRequests--;
        console.log(result[index]);

        // Set value of index to empty (undefined)
        delete queue[index];
    }, 100);
});

endTime = new Date();
var timeDiff = endTime - startTime; //in ms
// strip the ms
timeDiff /= 1000;

// get seconds 
var seconds = Math.round(timeDiff);
console.log(seconds + " seconds");
}

      console.log("end of the worker");
      

});

