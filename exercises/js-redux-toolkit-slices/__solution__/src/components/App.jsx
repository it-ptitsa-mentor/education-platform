import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import commentsSlice from '../slices/commentsSlice.js';

const comments = [
  { id: 'comment1', author: 'user2', text: 'Первый комментарий' },
  { id: 'comment2', author: 'user3', text: 'Второй комментарий' },
];

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(commentsSlice.actions.addComments(comments));
  }, [dispatch]);

  return <div>Forum App</div>;
}
