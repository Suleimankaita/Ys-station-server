
    const request_id=()=>{
        const now=new Date()
        const Year=now.getFullYear()
        const mouth=String(now.getMonth()+1).padStart(2,'0');
        const days=String( now.getDate()).padStart(2,'0')
        const hour=String(now.getHours()).padStart(2,'0')
        const minute=String(now.getMinutes()).padStart(2,'0')
        const all=`${Year}${mouth}${days}${days}${hour}${minute}`;
        const str=Math.random().toString(36).substring(2,8)
        return all+str
    }
    module.exports=request_id