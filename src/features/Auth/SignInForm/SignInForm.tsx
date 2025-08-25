import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import kakaoIcon from '@/assets/icons/kakao-icon.svg';
import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import Input from '@/features/Auth/components/Input/Input';
import PasswordInput from '@/features/Auth/components/Input/PasswordInput';
import { mockLogin } from '@/mocks/mockAuth';
import { signInSchema } from '@/schemas/auth.schema';
import type { SignInFormValues } from '@/schemas/auth.schema';
import { useAuthStore } from '@/stores/authStore';

import styles from './SignInForm.module.scss';

// 목 로그인 사용을 위해 실제 API 훅은 주석처리
// import useSignIn from '@/hooks/auth/useSignIn';
// import type { SignInURL } from '@/types/apiEndpoints.types';
// const signInURL: SignInURL = '/api/auth/signin';

export default function SignInForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
  });

  const navigate = useNavigate();
  const { isLoggedIn, setLoggedIn } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const email = watch('email');
  const password = watch('password');

  const onSubmit = async (data: SignInFormValues) => {
    setIsLoading(true);

    try {
      const result = await mockLogin(data.email, data.password);

      if (result.success && result.user && result.token) {
        // 목 로그인 성공 - authStore에 사용자 정보 설정
        setLoggedIn(
          {
            id: result.user.id,
            username: result.user.name,
            email: result.user.email,
            nickname: result.user.nickname,
            profileImageUrl: '',
          },
          result.token
        );
      }
    } catch {
      // setError('로그인 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
    // signInMutation.mutate(data);
  };

  useEffect(() => {
    if (isLoggedIn) navigate('/map');
  }, [isLoggedIn, navigate]);

  const isButtonDisabled = isLoading || !email || !password;

  const handleKakaoLogin = () => {
    // 카카오 로그인 구현
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormField label="이메일" htmlFor="email" required error={errors.email?.message}>
        <Input id="email" placeholder="user@goorm.com" {...register('email')} />
      </FormField>

      <FormField label="비밀번호" htmlFor="password" required error={errors.password?.message}>
        <PasswordInput id="password" placeholder="********" {...register('password')} />
      </FormField>

      <Button
        variant={isButtonDisabled ? 'ghost' : 'secondary'}
        radius="xsm"
        className={styles.loginBtn}
        type="submit"
        disabled={isButtonDisabled}
        height="45px"
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </Button>

      <Button
        variant="outline"
        radius="xsm"
        className={styles.kakaoLoginBtn}
        type="button"
        onClick={handleKakaoLogin}
        backgroundColor="#FEE500"
        textColor="#000000"
        fullWidth
        leftIcon={<img src={kakaoIcon} alt="카카오" className={styles.kakaoIcon} />}
        height="45px"
      >
        카카오 로그인
      </Button>
    </form>
  );
}
