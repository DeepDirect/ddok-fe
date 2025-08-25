import { mockUsers } from './mockUsers';

export interface MockFindIdData {
  username: string;
  phoneNumber: string;
  phoneCode: string;
}

export interface MockFindIdResponse {
  success: boolean;
  message: string;
  email?: string;
}

// 휴대폰 인증번호 발송 (아이디 찾기용)
export const mockSendPhoneCodeForFindId = async (
  phoneNumber: string,
  username: string
): Promise<{ success: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 800));

  // 목 데이터에서는 phoneNumber와 username을 검증하지 않고 항상 성공 처리
  console.log('Mock phone code sent for find ID:', phoneNumber, username);

  return {
    success: true,
    message: '인증번호가 발송되었습니다.',
  };
};

// 휴대폰 인증번호 확인 (아이디 찾기용)
export const mockVerifyPhoneCodeForFindId = async (
  phoneNumber: string,
  phoneCode: string
): Promise<{ success: boolean; verified: boolean; message: string }> => {
  await new Promise(resolve => setTimeout(resolve, 600));

  // 목 데이터에서는 123456 또는 000000을 올바른 인증번호로 처리
  const verified = phoneCode === '123456' || phoneCode === '000000';
  console.log('Mock phone verification for find ID:', phoneNumber, 'with code:', phoneCode);

  return {
    success: true,
    verified,
    message: verified ? '휴대폰 인증이 완료되었습니다.' : '인증번호가 올바르지 않습니다.',
  };
};

// 아이디 찾기
export const mockFindId = async (findIdData: MockFindIdData): Promise<MockFindIdResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  // 목 데이터에서 이름과 휴대폰 번호로 사용자 찾기
  const user = mockUsers.find(
    user => user.name === findIdData.username && user.phoneNumber === findIdData.phoneNumber
  );

  if (user) {
    // 전체 이메일을 반환 (마스킹 처리 제거)
    return {
      success: true,
      message: '가입된 이메일을 찾았습니다.',
      email: user.email,
    };
  } else {
    return {
      success: false,
      message: '일치하는 계정을 찾을 수 없습니다.',
    };
  }
};
