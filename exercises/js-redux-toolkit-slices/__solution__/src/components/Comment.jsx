import { useSelector } from 'react-redux';

export default function Comment({ id }) {
  const comment = useSelector((state) =>
    state.comments.items.find((c) => c.id === id),
  );
  const author = useSelector((state) =>
    state.users.items.find((u) => u.id === comment?.author),
  );

  if (!comment) return null;

  return (
    <div>
      <p>{comment.text}</p>
      <span>{author?.name}</span>
    </div>
  );
}
