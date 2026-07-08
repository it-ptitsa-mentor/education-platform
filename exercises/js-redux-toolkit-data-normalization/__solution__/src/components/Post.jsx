import { useSelector } from 'react-redux';
import { usersSelectors } from '../slices/usersSlice.js';

export default function Post({ post }) {
  const author = useSelector((state) =>
    usersSelectors.selectById(state, post.author),
  );

  return (
    <li>
      <strong>{author?.name}</strong>: {post.body}
    </li>
  );
}
