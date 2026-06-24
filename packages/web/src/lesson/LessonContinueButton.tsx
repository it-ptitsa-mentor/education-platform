import { Link } from "react-router-dom";
import type { LessonContinueTarget } from "../lib/lesson-units";

type LessonContinueButtonProps = {
  target: LessonContinueTarget;
  onNavigate?: () => void;
};

export const LessonContinueButton = ({
  target,
  onNavigate,
}: LessonContinueButtonProps) => (
  <div className="lesson-flow-continue">
    <Link
      to={target.to}
      className="btn btn-primary lesson-flow-continue-btn"
      onClick={onNavigate}
    >
      {target.label}
    </Link>
  </div>
);
