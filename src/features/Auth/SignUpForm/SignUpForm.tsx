import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import Input from '@/features/Auth/components/Input/Input';
import PasswordInput from '@/features/Auth/components/Input/PasswordInput';
import {
  mockCheckEmail,
  mockSendPhoneCode,
  mockVerifyPhoneCode,
  mockSignUp,
} from '@/mocks/mockSignUp';
import { signUpSchema } from '@/schemas/auth.schema';
import type { SignUpFormValues } from '@/schemas/auth.schema';

import styles from './SignUpForm.module.scss';

// API 연결 부분 주석 처리
// import type {
//   SignUpURL,
//   EmailCheckURL,
//   PhoneSendCodeURL,
//   PhoneVerifyCodeURL,
// } from '@/types/apiEndpoints.types';
// import {
//   useSignUp,
//   useCheckEmail,
//   useSendPhoneCode,
//   useVerifyPhoneCode,
// } from '@/hooks/auth/useSignUp';
// const signUpURL: SignUpURL = '/api/auth/signup';
// const emailCheckURL: EmailCheckURL = '/api/auth/email/check';
// const phoneSendCodeURL: PhoneSendCodeURL = '/api/auth/phone/send-code';
// const phoneVerifyCodeURL: PhoneVerifyCodeURL = '/api/auth/phone/verify-code';

export default function SignUpForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const navigate = useNavigate();

  // 상태 관리
  const [emailVerified, setEmailVerified] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isLoading, setIsLoading] = useState({
    email: false,
    phone: false,
    verify: false,
    submit: false,
  });
  const [error, setError] = useState<string | null>(null);

  // 폼 데이터 감시
  const email = watch('email');
  const username = watch('username');
  const phone = watch('phoneNumber');
  const phoneCode = watch('phoneCode');

  // API 훅들 주석 처리
  // const signUpMutation = useSignUp(signUpURL);
  // const checkEmailMutation = useCheckEmail(emailCheckURL, {
  //   onSuccess: data => {
  //     if (data.data.isAvailable) {
  //       setEmailVerified(true);
  //     }
  //   },
  // });
  // const sendPhoneCodeMutation = useSendPhoneCode(phoneSendCodeURL, {
  //   onSuccess: () => {
  //     setCodeSent(true);
  //     startTimer();
  //   },
  //   onError: error => {
  //     console.error('인증번호 발송 실패:', error);
  //   },
  // });
  // const verifyPhoneCodeMutation = useVerifyPhoneCode(phoneVerifyCodeURL, {
  //   onSuccess: data => {
  //     if (data.data.verified) {
  //       setCodeVerified(true);
  //     }
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

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!email) {
      return;
    }

    setIsLoading(prev => ({ ...prev, email: true }));
    setError(null);

    try {
      const result = await mockCheckEmail(email.trim());
      if (result.success && result.isAvailable) {
        setEmailVerified(true);
      }
    } catch {
      setError('이메일 중복 확인에 실패했습니다.');
    } finally {
      setIsLoading(prev => ({ ...prev, email: false }));
    }
  };

  // 인증번호 발송
  const handleSendPhoneCode = async () => {
    if (!phone || !username) {
      return;
    }

    setIsLoading(prev => ({ ...prev, phone: true }));
    setError(null);

    try {
      const cleanPhoneNumber = phone.replace(/-/g, '');
      const result = await mockSendPhoneCode(cleanPhoneNumber, username.trim());

      if (result.success) {
        setCodeSent(true);
        startTimer();
      }
    } catch {
      setError('인증번호 발송에 실패했습니다.');
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
    setError(null);

    try {
      const cleanPhoneNumber = phone.replace(/-/g, '');
      const result = await mockVerifyPhoneCode(cleanPhoneNumber, phoneCode.trim());

      if (result.success && result.verified) {
        setCodeVerified(true);
      } else {
        setError(result.message);
      }
    } catch {
      setError('인증번호 확인에 실패했습니다.');
    } finally {
      setIsLoading(prev => ({ ...prev, verify: false }));
    }
  };

  // 폼 제출
  const onSubmit = async (data: SignUpFormValues) => {
    if (!emailVerified) {
      setError('이메일 중복 확인을 완료해주세요.');
      return;
    }

    if (!codeVerified) {
      setError('휴대폰 인증을 완료해주세요.');
      return;
    }

    setIsLoading(prev => ({ ...prev, submit: true }));
    setError(null);

    try {
      const signUpData = {
        ...data,
        phoneNumber: data.phoneNumber.replace(/-/g, ''), // 하이픈 제거
      };

      const result = await mockSignUp(signUpData);

      if (result.success) {
        // 회원가입 성공 시 회원가입 완료 페이지로 이동
        navigate('/auth/signupcomplete');
      } else {
        setError(result.message);
      }
    } catch {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(prev => ({ ...prev, submit: false }));
    }
  };

  const isSubmitting = isLoading.submit;
  const isButtonDisabled = isSubmitting || !emailVerified || !codeVerified;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <FormField label="이메일" htmlFor="email" required error={errors.email?.message}>
        <div className={styles.fieldWithButton}>
          <Input id="email" {...register('email')} placeholder="user@goorm.com" />
          <Button
            type="button"
            onClick={handleCheckEmail}
            disabled={!email || emailVerified || isLoading.email}
            variant={emailVerified ? 'ghost' : 'secondary'}
            radius="xsm"
            height="45px"
          >
            {isLoading.email ? '확인 중...' : emailVerified ? '중복 확인 완료' : '중복 확인'}
          </Button>
        </div>
      </FormField>

      <FormField label="이름" htmlFor="username" required error={errors.username?.message}>
        <Input id="username" {...register('username')} placeholder="구름" />
      </FormField>

      <FormField label="비밀번호" htmlFor="password" required error={errors.password?.message}>
        <PasswordInput id="password" {...register('password')} placeholder="********" />
      </FormField>

      <FormField
        label="비밀번호 확인"
        htmlFor="passwordCheck"
        required
        error={errors.passwordCheck?.message}
      >
        <PasswordInput id="passwordCheck" {...register('passwordCheck')} placeholder="********" />
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
        variant={emailVerified && codeVerified ? 'secondary' : 'ghost'}
        radius="xsm"
        height="45px"
      >
        {isSubmitting ? '회원가입 중...' : '회원가입'}
      </Button>
    </form>
  );
}
