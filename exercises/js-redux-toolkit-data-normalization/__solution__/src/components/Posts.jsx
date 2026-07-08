import { useSelector } from 'react-redux';
import { postsSelectors } from '../slices/postsSlice.js';
import Post from './Post.jsx';

export default function Posts() {
  const posts = useSelector(postsSelectors.selectAll);

  return (
    <ul>
      {posts.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </ul>
  );
}
