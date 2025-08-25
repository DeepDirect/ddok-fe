import { useNavigate, useSearchParams } from 'react-router-dom';

import Button from '@/components/Button/Button';

import styles from './FindIdCompletePage.module.scss';

export default function FindIdCompletePage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const navigate = useNavigate();

  // 이메일이 없으면 FindId 페이지로 리다이렉트
  if (!email) {
    navigate('/auth/findid');
    return null;
  }

  return (
    <div className={styles.inner}>
      <h1 className={styles.title}>당신의 이메일은!</h1>
      <div className={styles.email}>
        <span>{email}</span>
      </div>
      <Button
        className={styles.submitBtn}
        variant="secondary"
        type="button"
        onClick={() => navigate('/auth/signin')}
        radius="xsm"
        height="45px"
      >
        로그인으로
      </Button>
    </div>
  );
}
