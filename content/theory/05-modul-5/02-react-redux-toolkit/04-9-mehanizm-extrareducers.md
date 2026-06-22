---
title: "9. Механизм ExtraReducers"
module: "Модуль 5"
topic: "React: Redux Toolkit"
buildin_id: a75d2562-c7b9-40d9-a606-dde5a8294734
---

# 9. Механизм ExtraReducers

Разделение данных по слайсам и по редьюсерам в Redux приводит к ситуациям, когда на одно действие нужно реагировать в разных частях хранилища. Например, если мы удаляем пост, то нужно удалить и комментарии к нему — а они находятся в другом слайсе.

В Redux такая задача решается просто — мы добавляем в `switch` реакции на нужное действие по его имени. В Redux Toolkit так уже не получится. Дело в том, что между редьюсерами и действиями есть неразрывная связь. Это цена, которую мы платим за сокращение кода.

Для реакции на действия, происходящие в других слайсах, Redux Toolkit добавляет `extraReducers` — механизм дополнительных редьюсеров. Работает он достаточно просто. В слайс добавляется свойство `extraReducers`, через которое можно устанавливать реакцию (редьюсеры) на внешние действия:

```javascript
// Импортируем из других слайсов действия, на которые нужно реагировать
import { removePost } from '../postsSlice.js'

const postCommentsAdapter = createEntityAdapter()
const initialState = postCommentsAdapter.getInitialState()

const postCommentsSlice = createSlice({
  name: 'comments',
  initialState: initialState,
  reducers: {
    // Обычные редьюсеры
  },
  extraReducers: (builder) => { // Дополнительные редьюсеры
    // При удалении поста нужно удалить все его комментарии
    builder.addCase(removePost, (state, action) => {
      const postId = action.payload
      // Выбираем все комментарии кроме тех, что нужно удалить
      const restEntities = Object.values(state.entities).filter(e => e.postId !== postId)
      // setAll удаляет текущие сущности и добавляет новые
      postCommentsAdapter.setAll(state, restEntities)
    })
  },
})

// Где-то в приложении
dispatch(removePost(post.id))
```

Дополнительные редьюсеры добавляются как кейсы в объект `builder`, изменяя его напрямую. Поэтому нам не нужно ничего возвращать. Более того, `builder` поддерживает цепочки, то есть мы можем вызывать добавление кейсов друг за другом:

```javascript
builder.addCase().addCase()...
```

## Дополнительные материалы

- [Документация по Extra Reducers](https://redux-toolkit.js.org/api/createslice#extrareducers)

- [Как увидеть state внутри reduce](https://ru.hexlet.io/qna/javascript/questions/kak-uvidet-state-vnutri-reduce)

## **Далее → **
