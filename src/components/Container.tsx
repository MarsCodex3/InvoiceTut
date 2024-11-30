

import { cn } from "@/lib/utils"

interface ContainerProps extends React.ComponentProps<"div">{
}


const Container =({children,className, ...props}: ContainerProps) =>{
    //why the three dots?
    return(
        <div {...props} className={cn("max-w-5xl mx-auto px-5",className)}>
            {children}
        </div>
    )
}

export default Container;