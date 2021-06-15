import 'typeface-roboto-slab';
import './reset.css';
import './app.css';
import { Provider } from 'react-redux';
import styles from './app.module.scss';
import Logo from './trello-logo.gif';
import Draggable from 'react-draggable';
import React, { useRef, useState } from 'react';
import { Column as ColumnModel, store, Task, useAppDispatch, useAppSelector, useGetColumnsQuery } from './state';

const Header = () => (
  <header className={styles.header}>
    <div className={styles.header__logo}>
      <img src={Logo} alt="" />
    </div>
  </header>
);

const Card = ({ content }: Task) => {
  const [value, setValue] = useState<string>(content);
  const ref = useRef(null);
  function onChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setValue(evt.target.value);
  }
  function onSubmit(evt: React.SyntheticEvent) {
    evt.preventDefault();
    console.log('SAVE');
  }
  return (
    <Draggable nodeRef={ref}>
      <form ref={ref} onSubmit={onSubmit}>
        <input type="text" value={value} className={styles.card} onChange={onChange} />
      </form>
    </Draggable>
  );
}

const Column = ({ id, name }: ColumnModel) => (
  <div className={styles.column} >
    <header>{name}</header>
    {/* { tasks.map((task) => <Card key={task.id} {...task} />) } */}
    <div className={styles.column__button_container}>
      <span className={styles.column__plus_icon}>+</span>
      <span>Add another card</span>
    </div>
  </div>
);

const Content = () =>  {
  const { data , error, isLoading } = useGetColumnsQuery(null);
  const dispatch = useAppDispatch();
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
