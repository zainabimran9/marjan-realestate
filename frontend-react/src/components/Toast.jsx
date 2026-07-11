import { useEffect, useRef, useState } from "react";
import { subscribeToast } from "../lib/toast";

export default function Toast() {
  const [message, setMessage] = useState("");
  const [show, setShow] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return subscribeToast((msg) => {
      setMessage(msg);
      setShow(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setShow(false), 3200);
    });
  }, []);

  return (
    <div className={`toast${show ? " show" : ""}`}>{message}</div>
  );
}
