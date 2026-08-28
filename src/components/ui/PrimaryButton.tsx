import { Button, type ButtonProps } from "@mui/material";

interface Props extends ButtonProps {
    text: string;
}

export default function PrimaryButton({text, ...props}:Props) {


    return (
        <Button sx={{
            backgroundColor: "#DB4444",
            color: "white",
            py: 2,
            px: 6,
            minWidth: 150,
            fontSize: 18,
            fontWeight: 600
        }}
        {...props}
        >
            {text}
        </Button>
    )
}
