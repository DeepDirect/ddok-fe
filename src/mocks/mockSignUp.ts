import { mockUsers } from './mockUsers';

export interface MockSignUpData {
  email: string;
  username: string;
  password: string;
  passwordCheck: string;
  phoneNumber: string;
  phoneCode: string;
}

export interface MockSignUpResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    username: string;
    nickname: string;
  };
}

// 이메일 중복 확인
export const mockCheckEmail = async (
  email: string
): Promise<{ success: boolean; isAvailable: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const isAvailable = !mockUsers.some(user => user.email === email);

  return {
    success: true,
    isAvailable,
    message: isAvailable ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.',
  };
};

// 휴대폰 인증번호 발송
export const mockSendPhoneCode = async (
  phoneNumber: string,
  username: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  // 목 데이터에서는 phoneNumber와 username을 검증하지 않고 항상 성공 처리
  console.log('Mock phone code sent for:', phoneNumber, username);

  return {
    success: true,
    message: '인증번호가 발송되었습니다.',
  };
};

// 휴대폰 인증번호 확인
export const mockVerifyPhoneCode = async (
  phoneNumber: string,
  phoneCode: string
): Promise<{ success: boolean; verified: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  // 목 데이터에서는 123456 또는 000000을 올바른 인증번호로 처리
  const verified = phoneCode === '123456' || phoneCode === '000000';
  console.log('Mock phone verification for:', phoneNumber, 'with code:', phoneCode);

  return {
    success: true,
    verified,
    message: verified ? '휴대폰 인증이 완료되었습니다.' : '인증번호가 올바르지 않습니다.',
  };
};

// 회원가입
export const mockSignUp = async (signUpData: MockSignUpData): Promise<MockSignUpResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 이메일 중복 체크
  const emailExists = mockUsers.some(user => user.email === signUpData.email);
  if (emailExists) {
    return {
      success: false,
      message: '이미 사용 중인 이메일입니다.',
    };
  }

  // 새로운 사용자 ID 생성
  const newUserId = Math.max(...mockUsers.map(user => user.id)) + 1;

  // 새로운 사용자 생성 (실제로는 mockUsers에 추가하지 않음 - 목 데이터이므로)
  const newUser = {
    id: newUserId,
    email: signUpData.email,
    username: signUpData.username,
    nickname: signUpData.username, // 기본적으로 username을 nickname으로 사용
  };

  return {
    success: true,
    message: '회원가입이 완료되었습니다.',
    user: newUser,
  };
};
