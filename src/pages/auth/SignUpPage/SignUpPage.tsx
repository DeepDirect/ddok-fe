import { Link } from 'react-router-dom';

import SignUpForm from '@/features/Auth/SignUpForm/SignUpForm';

import styles from './SignUpPage.module.scss';

export default function SignUpPage() {
  return (
    <div className={styles.inner}>
      <h1 className={styles.title}>회원가입</h1>
      <p className={styles.text}>사용하실 이메일과 이름 등 정보를 입력하고, 회원이 되어 주세요!</p>

      <SignUpForm />

      <div className={styles.links}>
        <Link to="/auth/signin" className={`${styles.link} ${styles.linkWarning}`}>
          이미 계정이 있습니다! <span>로그인 하러 가기</span>
        </Link>
      </div>
    </div>
  );
}
