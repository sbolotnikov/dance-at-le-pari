"use client"

import classNames from "classnames";
import {motion} from "framer-motion";

export const PageWrapper = ({
    children, className
}:{
    children: React.ReactNode;
    className?:string
}) =>(
    <motion.div 
    initial={{opacity:0, y:50}}
    animate={{opacity:1, y:0}}
    exit={{opacity:0, y:50}}
    className={classNames("",className)}>
        {children}
    </motion.div>
 
)