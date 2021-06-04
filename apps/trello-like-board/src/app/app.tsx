import 'typeface-roboto-slab';
import './reset.css';
import './app.css';
import styles from './app.module.scss';
import Logo from './trello-logo.gif';
import Draggable from 'react-draggable';
import React, { useRef, useState } from 'react';

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

const Content = ({ children }: { children: React.ReactNode }) => <div className={styles.content} >{children}</div>;

const Card = ({ title }: Task) => {
  const [value, setValue] = useState<string>(title);
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

const Column = ({ tasks, title }: { tasks: Task[], title: string }) => (
  <div className={styles.column} >
    <header>{title}</header>
    { tasks.map((task) => <Card key={task.id} {...task} />) }
    <div className={styles.column__button_container}>
      <span className={styles.column__plus_icon}>+</span>
      <span>Add another card</span>
    </div>
  </div>
);

export function App() {
  return (
    <>
      <Header />
      <Content>
        <Column tasks={tasks} title="to do" />
        <Column tasks={tasks} title="in progress" />
        <Column tasks={tasks} title="done" />
      </Content>
    </>
  );
}

export default App;
