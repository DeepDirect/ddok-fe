import { Outlet } from 'react-router-dom';

import styles from './AuthLayout.module.scss';

const AuthLayout = () => {
  return (
    <div className={styles.container}>
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
