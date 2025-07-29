let localstream;
let remotestream;
let peerconnection;

const v1 =document.getElementById("v1")
const v2 =document.getElementById("v2")

const init=async()=>{

    localstream=await navigator.mediaDevices.getUserMedia({
        audio:false,
        video:true
    })

    v1.srcObject=localstream
    

    createOffer()
}


    const createOffer=async()=>{
    
        // peerconnection=new RTCPeerConnection();

        // remotestream=new MediaStream()


        // localstream.getTracks().forEach(tr=>{
        //     peerconnection.addTrack(tr,localstream)
        // })


        // peerconnection.ontrack=(e)=>{
        //     e.streams[0].getTracks().forEach(es=>{
        //     remotestream.addTrack(es)
        //     })
        // }

        // peerconnection.onicecandidate=async(e)=>{

        //     console.log(e)

        // }

        // let offer=await peerconnection.createOffer()

        //     await peerconnection.setLocalDescription(offer);
        
        //     const arr=[,,]

            // console.log(arr.length)


















    peerconnection=new RTCPeerConnection();

    remotestream=new MediaStream();

    
    
    localstream.getTracks().forEach(element => {
       peerconnection.addTrack(element,localstream)
    });

    
    
    peerconnection.ontrack=(e)=>{
        e.streams[0].getTracks().forEach(res=>{
            console.log(res)
        remotestream.addTrack(res)

        })
    }

    

    let offer=await peerconnection.createOffer()

    peerconnection.setLocalDescription(offer)





const obj = {};
const key1 = {};
const key2 = {};

obj[key1] = "value1";
obj[key2] = "value2";

console.log(obj[key1]);























        }

init()
