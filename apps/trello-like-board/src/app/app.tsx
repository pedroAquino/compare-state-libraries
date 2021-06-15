import 'typeface-roboto-slab';
import './reset.css';
import './app.css';
import { Provider } from 'react-redux';
import styles from './app.module.scss';
import Logo from './trello-logo.gif';
import Draggable, { DraggableData, DraggableEventHandler } from 'react-draggable';
import React, { useRef, useState } from 'react';
import { Column as ColumnModel, draggingSelector, dragSTop, store, Task, useAppDispatch, useAppSelector, useGetColumnsQuery, useGetTasksByColumnQuery } from './state';
import { wasDraggedInside } from './helper';

const Header = () => (
  <header className={styles.header}>
    <div className={styles.header__logo}>
      <img src={Logo} alt="" />
    </div>
  </header>
);

const Card = ({ content, id }: Task) => {
  const [value, setValue] = useState<string>(content);
  const ref = useRef(null);
  const dispatch = useAppDispatch();
  function onChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setValue(evt.target.value);
  }
  function onSubmit(evt: React.SyntheticEvent) {
    evt.preventDefault();
    console.log('SAVE');
  }
  function onDragStop(e: Event, {x, y} : DraggableData) {
    dispatch(dragSTop({
      coords: {x, y},
      draggableItemId: id
    }));
  }
  return (
    <Draggable onStop={onDragStop} defaultClassName={styles.card} nodeRef={ref}>
      <form id={id} ref={ref} onSubmit={onSubmit}>
        <input type="text" value={value} className={styles.card__input} onChange={onChange} />
      </form>
    </Draggable>
  );
}

const Column = ({ id, name }: ColumnModel) => {
  const { data , error, isLoading } = useGetTasksByColumnQuery(id);
  const ref = useRef(null);
  const draggingState = useAppSelector(draggingSelector);
  const haveSomethingInside = wasDraggedInside(draggingState.coords, ref.current);
  //console.log('haveSomethingInside', haveSomethingInside, ref.current);
  return (
    <div ref={ref} className={styles.column}>
      <div className={styles.column__inner}>
        <header>{name}</header>
        {
          error ? (<>There was an error fetching the data</>) :
          isLoading ? (<>Loading...</>) :
          data ? (data.map(task => <Card key={task.id}  {...task} />)) :
          null
        }
        <div className={styles.column__button_container}>
          <span className={styles.column__plus_icon}>+</span>
          <span>Add another card</span>
        </div>
      </div>
    </div>
  );
}

const Content = () =>  {
  const { data , error, isLoading } = useGetColumnsQuery(null);
  return (
    <div className={styles.content}>
      {
        error ? (<>There was an error fetching the data</>) :
        isLoading ? (<>Loading...</>) :
        data ? (data.map(col => <Column key={col.id}  {...col} />)) :
        null
      }
    </div>
  );
};

export function App() {
  return (
    <Provider store={store}>
      <Header />
      <Content />
    </Provider>
  );
}

export default App;
