import {Star} from "lucide-react"

type EstrellasProps={
    calificacion:number
}
export function Estrellas({calificacion}:EstrellasProps){
    const array=[];
    for(let i=1; i<=5; i++){
        if(i<=calificacion){
            array.push(1)
        }else{
            array.push(0)
        }
    }

    return(
        <div className="flex gap-1">
            {array.map((value,index)=>(
                <Star key={index} className={`${value ? 'fill-current text-yellow-500' : 'fill-none'}`}/>
            ))}
        </div>

    );
}