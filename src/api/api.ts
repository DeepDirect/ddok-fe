import axios from 'axios';

interface QueuedRequest {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

if (!BASE_URL) {
  console.error('VITE_BASE_URL is not defined in environment variables');
}

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// 토큰 갱신 중인지 확인하는 플래그
let isRefreshing = false;
let failedQueue: QueuedRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token!);
    }
  });

  failedQueue = [];
};

const tokenUtils = {
  getToken: (): string | null => sessionStorage.getItem('accessToken'),

  setToken: (token: string): void => {
    sessionStorage.setItem('accessToken', token);
  },

  removeToken: (): void => {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  },
};

api.interceptors.request.use(config => {
  const token = tokenUtils.getToken();

  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;
    const req = originalRequest as typeof originalRequest & { _retry?: boolean };

    const status = error.response?.status as number | undefined;
    const url = originalRequest?.url ?? '';

    // 401 에러이고 아직 재시도하지 않은 요청인 경우
    if (status === 401 && !req._retry && !url.includes('/api/auth/token')) {
      if (isRefreshing) {
        // 이미 토큰 갱신 중이면 큐에 추가하고 대기
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      req._retry = true;
      isRefreshing = true;

      try {
        // 토큰 갱신 요청
        const response = await api.post('/api/auth/token');
        const { accessToken } = response.data.data;

        // 새 토큰을 세션스토리지에 저장
        tokenUtils.setToken(accessToken);

        // 대기 중인 요청들 처리
        processQueue(null, accessToken);

        // 원래 요청에 새 토큰으로 재시도
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 로그아웃 처리
        processQueue(refreshError, null);

        // 세션스토리지 정리
        tokenUtils.removeToken();

        // 로그인 페이지로 리다이렉트 (필요시)
        window.location.href = '/auth/signin';

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 에러 처리 (권한 없음)
    if (error.response?.status === 403) {
      console.error('Access denied:', error.response.data?.message);
      // 필요시 권한 없음 페이지로 리다이렉트
    }

    // 5xx 서버 에러 처리
    if (error.response?.status && error.response.status >= 500) {
      console.error('Server error:', error.response.data?.message);
      // 필요시 에러 페이지 표시 또는 토스트 알림
    }

    // 네트워크 에러 처리
    if (!error.response) {
      console.error('Network error:', error.message);
      // 필요시 네트워크 에러 알림
    }

    return Promise.reject(error);
  }
);

export default api;
