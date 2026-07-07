// @ts-check

import cn from 'classnames';
import React, { useState } from 'react';

const BtnGroup = () => {
  // BEGIN (write your solution here)
  const [pressed, setPressed] = useState(null);

  const btnClass = (name) => cn('btn', 'btn-secondary', { active: pressed === name });

  return (
    <div className="btn-group" role="group">
      <button type="button" className={btnClass('left')} onClick={() => setPressed('left')}>
        Left
      </button>
      <button type="button" className={btnClass('right')} onClick={() => setPressed('right')}>
        Right
      </button>
    </div>
  );
  // END
};

export default BtnGroup;
