import { useEffect, useRef } from "react";

export default function useDialogFocus(open, ref, onClose) {
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const getControls = () => [...(ref.current?.querySelectorAll('a[href], button:not(:disabled), input, textarea, [tabindex="0"]') || [])];
    const frame = requestAnimationFrame(() => (getControls()[0] || ref.current)?.focus());
    const handleKey = event => {
      if (event.key === "Escape") closeRef.current();
      if (event.key !== "Tab") return;
      const controls = getControls();
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first) { event.preventDefault(); return; }
      if (event.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, [open, ref]);
}
