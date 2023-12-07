import { FacebookAuthProvider, GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"; // 1
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider(); // 2
      const auth = getAuth(app); // 3

      const result = await signInWithPopup(auth, provider); // 3

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };

  // const handleFacebookClick =async () => {
  //   try {
  //     const provider = new FacebookAuthProvider(); // 2
  //     const auth = getAuth(app); // 3

  //     const result = await signInWithPopup(auth, provider); // 3

  //     const res = await fetch("/api/auth/facebook", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         name: result.user.displayName,
  //         email: result.user.email,
  //         photo: result.user.photoURL,
  //       }),
  //     });
  //     const data = await res.json();
  //     dispatch(signInSuccess(data));
  //     navigate("/");
  //   } catch (error) {
  //     console.log("could not sign in with Facebook", error);
  //   }
  // };

  const fbProvider = new FacebookAuthProvider();

  const FaceBookLogin = async () => {
    try {
      const auth = getAuth(app); // 3
      const result = await signInWithPopup(auth, fbProvider)
      console.log(result);
      navigate("/");
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="">
      <button
        onClick={handleGoogleClick}
        type="button"
        className="bg-green-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
      >
        Continue With Google
      </button>

      <button className="bg-blue-600 text-white p-3 rounded-lg uppercase hover:opacity-95" onClick={FaceBookLogin} type="button">
        Continue with Facebook
      </button>
    </div>
  );
}
