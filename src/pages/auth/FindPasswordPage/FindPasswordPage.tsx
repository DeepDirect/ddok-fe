import { Link } from 'react-router-dom';

import FindPasswordForm from '@/features/Auth/FindPasswordForm/FindPasswordForm';
import { useAuthRedirect } from '@/hooks/auth/useAuthRedirect';

import styles from './FindPasswordPage.module.scss';

export default function FindPasswordPage() {
  // 로그인된 사용자는 메인 페이지로 리다이렉트
  useAuthRedirect('/map');

  return (
    <div className={styles.inner}>
      <h1 className={styles.title}>비밀번호를 잊어버리셨습니까?</h1>
      <p className={styles.text}>가입한 정보를 입력하고, 새로운 비밀번호로 변경하세요!</p>

      <FindPasswordForm />

      <div className={styles.links}>
        <Link to="/auth/findid" className={styles.link}>
          이메일이 기억이 나지 않습니다..
        </Link>
        <Link to="/auth/signin" className={`${styles.link} ${styles.linkWarning}`}>
          <span>비밀번호가 기억 나는거 같아요!</span>
        </Link>
      </div>
    </div>
  );
}
