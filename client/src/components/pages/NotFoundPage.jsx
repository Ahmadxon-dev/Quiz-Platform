import React from 'react';
import {Button} from "@/components/ui/button.jsx";
import {Link} from "react-router-dom";
import {ArrowLeft} from "lucide-react";

function NotFoundPage(props) {
    return (
        <div className="flex h-full pt-32 flex-col items-center justify-center bg-background px-4 text-center">
            <div className="max-w-md space-y-8">
                <div className="space-y-2">
                    <h1 className="text-9xl font-bold tracking-tighter text-primary">404</h1>
                    <h2 className="text-3xl font-medium tracking-tight text-foreground">Sahifa topilmadi</h2>
                    <p className="text-muted-foreground">Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan.</p>
                </div>

                <div className="h-px w-full bg-border" />

                <Button asChild variant="outline" className="gap-2 group">
                    <Link href="/">
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Bosh Sahifaga Qaytish</span>
                    </Link>
                </Button>
            </div>
        </div>
    );
}

export default NotFoundPage;