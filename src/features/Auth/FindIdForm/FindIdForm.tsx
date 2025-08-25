import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import Button from '@/components/Button/Button';
import FormField from '@/features/Auth/components/FormField/FormField';
import Input from '@/features/Auth/components/Input/Input';
import {
  mockSendPhoneCodeForFindId,
  mockVerifyPhoneCodeForFindId,
  mockFindId,
} from '@/mocks/mockFindId';
import { findIdSchema } from '@/schemas/auth.schema';
import type { FindIdFormValues } from '@/schemas/auth.schema';

import styles from './FindIdForm.module.scss';

// API 연결 부분 주석 처리
// import type {
//   FindIdURL,
//   PhoneSendCodeURL,
//   PhoneVerifyCodeURL,
// } from '@/types/apiEndpoints.types';
// import {
//   useFindId,
//   useSendPhoneCodeForFindId,
//   useVerifyPhoneCodeForFindId,
// } from '@/hooks/auth/useFindId';
// const findIdURL: FindIdURL = '/api/auth/email/find';
// const phoneSendCodeURL: PhoneSendCodeURL = '/api/auth/phone/send-code';
// const phoneVerifyCodeURL: PhoneVerifyCodeURL = '/api/auth/phone/verify-code';

export default function FindIdForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FindIdFormValues>({
    resolver: zodResolver(findIdSchema),
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
  // const findIdMutation = useFindId(findIdURL);
  // const sendPhoneCodeMutation = useSendPhoneCodeForFindId(phoneSendCodeURL, {
  //   onSuccess: () => {
  //     setCodeSent(true);
  //     startTimer();
  //   },
  //   onError: error => {
  //     console.error('인증번호 발송 실패:', error);
  //   },
  // });
  // const verifyPhoneCodeMutation = useVerifyPhoneCodeForFindId(phoneVerifyCodeURL, {
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

  // 인증번호 발송
  const handleSendPhoneCode = async () => {
    if (!phone || !username) {
      return;
    }

    setIsLoading(prev => ({ ...prev, phone: true }));

    try {
      const cleanPhoneNumber = phone.replace(/-/g, '');
      const result = await mockSendPhoneCodeForFindId(cleanPhoneNumber, username.trim());

      if (result.success) {
        setCodeSent(true);
        startTimer();
      }
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
    // setError(null);

    try {
      const cleanPhoneNumber = phone.replace(/-/g, '');
      const result = await mockVerifyPhoneCodeForFindId(cleanPhoneNumber, phoneCode.trim());

      if (result.success && result.verified) {
        setCodeVerified(true);
      }
    } finally {
      setIsLoading(prev => ({ ...prev, verify: false }));
    }
  };

  // 폼 제출
  const onSubmit = async (data: FindIdFormValues) => {
    if (!codeVerified) {
      return;
    }

    setIsLoading(prev => ({ ...prev, submit: true }));

    try {
      const findIdData = {
        username: data.username,
        phoneNumber: data.phoneNumber.replace(/-/g, ''), // 하이픈 제거
        phoneCode: data.phoneCode,
      };

      const result = await mockFindId(findIdData);

      if (result.success && result.email) {
        // 찾은 이메일과 함께 완료 페이지로 이동
        navigate(`/auth/findidcomplete?email=${encodeURIComponent(result.email)}`);
      }
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
        {isSubmitting ? '아이디 찾는 중...' : '아이디 찾기'}
      </Button>
    </form>
  );
}
