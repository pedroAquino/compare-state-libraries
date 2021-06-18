import 'typeface-roboto-slab';
import './reset.css';
import './app.css';
import styles from './app.module.scss';
import Logo from './trello-logo.gif';
import Draggable from 'react-draggable';
import React, { Suspense, useEffect, useRef, useState } from 'react';
import { RecoilRoot, useRecoilValue } from 'recoil';
import { Column as ColumnModel, columnsListQuery, getTasksQuery } from './state';

interface Task {
  id: number;
  title: string;
  content: string;
};

const tasks = [
  {
    id: 1,
    title: 'task 1',
    content: 'some content'
  }
];

const Header = () => (
  <header className={styles.header}>
    <div className={styles.header__logo}>
      <img src={Logo} alt="" />
    </div>
  </header>
);

const Card = ({ content }: Task) => {
  console.log(content)
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

const Column = ({ name, id, tasks }: ColumnModel) => {
  return (
    <div className={styles.column} >
      <header>{name}</header>
      {tasks.map((task: Task) => (
        <div className={styles.column__card}>
          <Card key={task.id} {...task} />
        </div>
      ))}
      <div className={styles.column__button_container}>
        <span className={styles.column__plus_icon}>+</span>
        <span>Add another card</span>
      </div>
    </div>
  );
};


const Content = () => {
  const columns = useRecoilValue(columnsListQuery);
  const tasks = useRecoilValue(getTasksQuery);
  return (
    <div className={styles.content}>
        {
          columns.map(col => <Column key={col.id} {...col} tasks={tasks[col.id]}  />)
        }
    </div>
  )
}


export function App() {  
  return (
    <RecoilRoot>
      <Suspense fallback={<p>Loading...</p>}>
        <Header />
        <Content />
      </Suspense>
    </RecoilRoot>
  );
}

export default App;
