import { findUserByCredentials } from './mockUsers';

export interface MockLoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: number;
    email: string;
    name: string;
    nickname: string;
  };
  token?: string;
}

export const mockLogin = async (email: string, password: string): Promise<MockLoginResponse> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = findUserByCredentials(email, password);

  if (user) {
    return {
      success: true,
      message: '로그인 성공',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
      },
      token: `mock_token_${user.id}_${Date.now()}`,
    };
  } else {
    return {
      success: false,
      message: '이메일 또는 비밀번호가 올바르지 않습니다.',
    };
  }
};
