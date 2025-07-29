const list=require('./allowed')

    const opt={
        origin:(origin,cb)=>{
            if(!origin || list.includes(origin)){
                cb(null,true)
            }else{
                cb(new Error('not Allowed by cors'))

            }
        }
    }

    module.exports=opt;