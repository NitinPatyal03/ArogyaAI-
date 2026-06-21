import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

function GoogleFitLogin() {
  const login = useGoogleLogin({
    flow: "implicit",

    scope: [
      "https://www.googleapis.com/auth/fitness.activity.read",
      "https://www.googleapis.com/auth/fitness.heart_rate.read",
      "https://www.googleapis.com/auth/fitness.sleep.read",
    ].join(" "),

    onSuccess: (tokenResponse) => {
      console.log("SUCCESS", tokenResponse);

      localStorage.setItem("google_access_token", tokenResponse.access_token);

      toast.success("Google Fit Connected ⌚");
    },

    onError: (error) => {
      console.error("Google OAuth Error:", error);

      toast.error("Google Login Failed");
    },
  });

  return (
    <button
      onClick={() => login()}
      className="
      bg-cyan-600
      hover:bg-cyan-700
      text-white
      px-5
      py-3
      rounded-2xl
      shadow-lg
      "
    >
      ⌚ Connect Google Fit
    </button>
  );
}

export default GoogleFitLogin;
