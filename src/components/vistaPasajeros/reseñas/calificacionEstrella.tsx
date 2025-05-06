import { Star } from "lucide-react";
import { useState } from "react";

type CalificacionEstrellaProps={
    set:(index:number)=>void;
}

export function CalificacionEstrellas({set}:CalificacionEstrellaProps){
    const [calificar, setCalificar] = useState<number>(0);
    


    function handleClick(index: number) {
        setCalificar(index)
       if(set) set(index);
       
    }
    return (
        <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((index) => (
          <Star
            key={index}
            size={32}
            className={`cursor-pointer transition-colors ${
              index <= calificar ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
            }`}
            fill={index <= calificar ? "currentColor" : "none"}
            onClick={() => handleClick(index)}
          />
        ))}
      </div>
    );
}