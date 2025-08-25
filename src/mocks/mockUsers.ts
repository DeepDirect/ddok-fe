export interface MockUser {
  id: number;
  email: string;
  password: string;
  name: string;
  nickname: string;
  phoneNumber: string;
}

export const mockUsers: MockUser[] = [
  {
    id: 1,
    email: 'test@test.com',
    password: 'Test1234!',
    name: '테스트',
    nickname: '테스트 사용자',
    phoneNumber: '01012345678',
  },
];

export const findUserByCredentials = (email: string, password: string): MockUser | undefined => {
  return mockUsers.find(user => user.email === email && user.password === password);
};
