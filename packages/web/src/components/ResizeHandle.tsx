import { useEffect, useRef } from "react";

type ResizeHandleProps = {
  orientation: "horizontal" | "vertical";
  onResize: (delta: number) => void;
  label: string;
};

export const ResizeHandle = ({
  orientation,
  onResize,
  label,
}: ResizeHandleProps) => {
  const dragging = useRef(false);
  const lastPoint = useRef(0);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      if (!dragging.current) return;
      const point =
        orientation === "horizontal" ? event.clientX : event.clientY;
      const delta = point - lastPoint.current;
      lastPoint.current = point;
      onResize(delta);
    };

    const handleUp = () => {
      dragging.current = false;
      document.body.classList.remove("is-resizing", "is-resizing-vertical");
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [onResize, orientation]);

  return (
    <button
      type="button"
      className={`resize-handle resize-handle--${orientation}`}
      aria-label={label}
      onMouseDown={(event) => {
        dragging.current = true;
        lastPoint.current =
          orientation === "horizontal" ? event.clientX : event.clientY;
        document.body.classList.add("is-resizing");
        if (orientation === "vertical") {
          document.body.classList.add("is-resizing-vertical");
        }
      }}
    />
  );
};
