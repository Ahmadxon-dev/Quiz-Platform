import React from 'react';
import {Loader2} from "lucide-react";

function Loader({variant = "big"}) {
    if (variant === "big") {
        return (
            <div className={`grid items-center justify-center m-auto`}>
                <Loader2 className="mr-2 h-20 w-20 animate-spin"/>
            </div>
        );
    }
    if (variant === "small") {
        return <Loader2 className="ml-2 h-4 w-4 animate-spin"/>
    }

}

export default Loader;