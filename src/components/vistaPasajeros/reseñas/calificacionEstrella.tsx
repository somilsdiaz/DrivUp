import { Star } from "lucide-react";
import { useState } from "react";

type CalificacionEstrellaProps={
    set:(index:number)=>void;
}

export function CalificacionEstrellas({set}:CalificacionEstrellaProps){
    const [arrayEstrellas, setArrayEstrellas] = useState<number[]>([0,0,0,0,0]);
    const [option, setOption]=useState<boolean>(false);
    

    function onClick(index:number){
        if(option){
        set(0);
        setOption(false);
        }else{
            set(index);
            setOption(true);
        }
    }
    function handleClick(index: number) {
       if(!option){
        const newArray = arrayEstrellas.map((value, i) => (i <= index ? 1 : 0));
        setArrayEstrellas(newArray);
       }
    }
    return (
        <div
        >
            {arrayEstrellas.map((value: number, index: number) => (
            <button
                key={index}
                onClick={() => onClick(index)} // Set hover effect on click
                onMouseEnter={() => handleClick(index)} // Set hover effect
                className="cursor-pointer"
            >
                <Star
                className={`${
                    value ? 'fill-current text-yellow-500' : 'fill-none'
                }`}
                />
            </button>
            ))}
        </div>
    );
}