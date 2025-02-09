import { useState } from "react";

export function Button (props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const [isDisabled, setIsDisabled] = useState(false);
    return (
        <button
            {...props}
            onClick={(e) => {
                setIsDisabled(true);
                props.onClick?.(e);
                setTimeout(() => setIsDisabled(false), 2000);
            }}
            disabled={props.disabled || isDisabled}
        />
    )
}
