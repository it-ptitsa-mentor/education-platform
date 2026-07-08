import { useSelector } from 'react-redux';
import { commentsSelectors } from '../slices/commentsSlice.js';
import { usersSelectors } from '../slices/usersSlice.js';

export default function Comment({ id }) {
  const comment = useSelector((state) => commentsSelectors.selectById(state, id));
  const author = useSelector((state) =>
    usersSelectors.selectById(state, comment?.author),
  );

  if (!comment) return null;

  return (
    <div>
      <span>{author?.name}</span>: {comment.text}
    </div>
  );
}
