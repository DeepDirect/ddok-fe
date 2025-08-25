import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import Input from '@/features/Auth/components/Input/Input';
import { findPasswordSchema, type FindPasswordFormValues } from '@/schemas/auth.schema';

// API 연결 부분 주석 처리
// import {
//   useFindPassword,
//   useSendPhoneCodeForFindPassword,
//   useVerifyPhoneCodeForFindPassword,
// } from '@/hooks/auth/useFindPassword';
// import type {
//   FindPasswordURL,
//   PhoneSendCodeURL,
//   PhoneVerifyCodeURL,
// } from '@/types/apiEndpoints.types';

import styles from './FindPasswordForm.module.scss';

// URL들 정의 (주석 처리)
// const findPasswordURL: FindPasswordURL = '/api/auth/password/verify-user';
// const phoneSendCodeURL: PhoneSendCodeURL = '/api/auth/phone/send-code';
// const phoneVerifyCodeURL: PhoneVerifyCodeURL = '/api/auth/phone/verify-code';

export default function FindPasswordForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FindPasswordFormValues>({
    resolver: zodResolver(findPasswordSchema),
    mode: 'onChange',
  });

  // 상태 관리
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState({
    phone: false,
    verify: false,
    submit: false,
  });

  // 폼 데이터 감시
  const username = watch('username');
  const phone = watch('phoneNumber');
  const phoneCode = watch('phoneCode');

  // API 훅들 주석 처리
  // const findPasswordMutation = useFindPassword(findPasswordURL);
  // const sendPhoneCodeMutation = useSendPhoneCodeForFindPassword(phoneSendCodeURL, {
  //   onSuccess: () => {
  //     setCodeSent(true);
  //     startTimer();
  //   },
  //   onError: error => {
  //     console.error('인증번호 발송 실패:', error);
  //   },
  // });
  // const verifyPhoneCodeMutation = useVerifyPhoneCodeForFindPassword(phoneVerifyCodeURL, {
  //   onSuccess: data => {
  //     if (data.data.verified) {
  //       setCodeVerified(true);
  //     }
  //   },
  //   onError: () => {
  //     console.error('인증번호 확인에 실패했습니다.');
  //   },
  // });

  // 타이머 로직
  const startTimer = () => {
    setTimer(59);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // 인증번호 발송
  const handleSendPhoneCode = async () => {
    if (!phone || !username) {
      return;
    }

    setIsLoading(prev => ({ ...prev, phone: true }));

    try {
      // 목 데이터로 처리
      await new Promise(resolve => setTimeout(resolve, 800));

      console.log('비밀번호 찾기 - 인증번호 발송 성공 (목 데이터)');
      setCodeSent(true);
      startTimer();
    } catch (error) {
      console.error('인증번호 발송 실패:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, phone: false }));
    }
  };

  // 인증번호 확인
  const handleVerifyPhoneCode = async () => {
    if (!phoneCode || !phone) {
      return;
    }

    setIsLoading(prev => ({ ...prev, verify: true }));

    try {
      // 목 데이터로 처리 (123456 또는 000000을 올바른 인증번호로 처리)
      await new Promise(resolve => setTimeout(resolve, 600));

      const verified = phoneCode === '123456' || phoneCode === '000000';

      if (verified) {
        setCodeVerified(true);
        console.log('휴대폰 인증 완료 (목 데이터)');
      } else {
        console.error('인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('인증번호 확인에 실패했습니다:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, verify: false }));
    }
  };

  // 폼 제출 - 사용자 검증 목 데이터 처리
  const onSubmit = async (data: FindPasswordFormValues) => {
    if (!codeVerified) {
      return;
    }

    setIsLoading(prev => ({ ...prev, submit: true }));

    try {
      // 목 데이터로 처리
      await new Promise(resolve => setTimeout(resolve, 1000));

      console.log('사용자 검증 요청 데이터 (목 데이터):', {
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber.replace(/-/g, ''),
        phoneCode: data.phoneCode,
      });

      // 목 reauthToken 생성
      const mockReauthToken = 'mock_reauth_token_' + Date.now();

      // localStorage에 reauthToken 저장
      localStorage.setItem('reauthToken', mockReauthToken);
      console.log('목 reauthToken 저장 완료:', '***' + mockReauthToken.slice(-4));

      // ResetPasswordPage로 이동
      navigate('/auth/resetpassword');
    } catch (error) {
      console.error('사용자 검증 실패:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const isSubmitting = isLoading.submit;
  const isButtonDisabled = isSubmitting || !codeVerified;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormField label="이름" htmlFor="username" required error={errors.username?.message}>
        <Input id="username" {...register('username')} placeholder="구름" />
      </FormField>

      <FormField label="이메일" htmlFor="email" required error={errors.email?.message}>
        <Input id="email" {...register('email')} placeholder="user@goorm.com" />
      </FormField>

      <FormField
        label="휴대폰 번호"
        htmlFor="phoneNumber"
        required
        error={errors.phoneNumber?.message}
      >
        <div className={styles.fieldWithButton}>
          <Input id="phoneNumber" {...register('phoneNumber')} placeholder="01012345678" />
          <Button
            type="button"
            onClick={handleSendPhoneCode}
            disabled={!phone || !username || timer > 0 || isLoading.phone}
            variant={codeSent ? 'ghost' : 'secondary'}
            radius="xsm"
            height="45px"
          >
            {isLoading.phone ? '발송 중...' : timer > 0 ? `0:${timer}` : '인증번호 발송'}
          </Button>
        </div>
      </FormField>

      <FormField label="인증번호" htmlFor="phoneCode" required error={errors.phoneCode?.message}>
        <div className={styles.fieldWithButton}>
          <Input id="phoneCode" {...register('phoneCode')} placeholder="123456" />
          <Button
            type="button"
            onClick={handleVerifyPhoneCode}
            disabled={!phoneCode || codeVerified || isLoading.verify}
            variant={codeVerified ? 'ghost' : 'secondary'}
            radius="xsm"
            height="45px"
          >
            {isLoading.verify ? '확인 중...' : codeVerified ? '인증 완료' : '인증하기'}
          </Button>
        </div>
      </FormField>

      <Button
        type="submit"
        className={styles.submitBtn}
        disabled={isButtonDisabled}
        variant={codeVerified ? 'secondary' : 'ghost'}
        radius="xsm"
        height="45px"
      >
        {isSubmitting ? '확인 중...' : '비밀번호 찾기'}
      </Button>
    </form>
  );
}
