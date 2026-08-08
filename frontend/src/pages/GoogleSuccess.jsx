import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function GoogleSuccess() {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {

        const token = searchParams.get("token");

        if (token) {

            localStorage.setItem("token", token);

            navigate("/welcome");

        } else {

            navigate("/");

        }

    }, [navigate, searchParams]);

    return (

        <div className="loading">
            Signing you in...
        </div>

    );

}