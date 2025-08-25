import { Link } from 'react-router-dom';

import Header from '@/features/Header/components/Header';

import styles from './DevPage.module.scss';

const DevPage: React.FC = () => {
  const isLoggedIn = true; // 또는 false
  const user = {
    nickname: '홍길동',
    profileImage: '/src/assets/images/avatar.png',
  };

  const routes: { path: string; name: string }[] = [
    { path: '/intro', name: '인트로 페이지(개발 완료 후 / 사용)' },
    { path: '/auth/signin', name: '로그인' },
    { path: '/auth/signup', name: '회원가입' },
    { path: '/auth/signupcomplete', name: '회원가입 완료' },
    { path: '/auth/findid', name: '아이디 찾기' },
    { path: '/auth/findidcomplete', name: '아이디 찾기 완료' },
    { path: '/auth/findpassword', name: '비밀번호 찾기' },
    { path: '/auth/resetpassword', name: '비밀번호 재설정' },
    { path: '/personalization', name: '개인화' },
    { path: '/map', name: '맵' },
    { path: '/search/project', name: '프로젝트 검색' },
    { path: '/search/study', name: '스터디 검색' },
    { path: '/search/player', name: '플레이어 검색' },
    { path: '/create/project', name: '프로젝트 생성' },
    { path: '/edit/project/1', name: '프로젝트 수정 (예시 ID: 1)' },
    { path: '/create/study', name: '스터디 생성' },
    { path: '/edit/study/1', name: '스터디 수정 (예시 ID: 1)' },
    { path: '/detail/project/1', name: '프로젝트 상세 (예시 ID: 1)' },
    { path: '/detail/study/1', name: '스터디 상세 (예시 ID: 1)' },
    { path: '/profile/user/1', name: '유저 프로필 (예시 ID: 1)' },
    { path: '/profile/my', name: '내 프로필' },
    { path: '/profile/my/edit', name: '내 정보 수정' },
    { path: '/team/1', name: '팀 페이지 (예시 ID: 1)' },
    { path: '/team/1/setting', name: '팀 설정 (예시 ID: 1)' },
    { path: '/ranking', name: '랭킹' },
    { path: '/button-example', name: '버튼 예시 페이지' },
  ];

  return (
    <>
      <Header variant={isLoggedIn ? 'user' : 'guest'} user={isLoggedIn ? user : undefined} />
      <div className={styles.container}>
        <h1 className={styles.title}>🚀 개발용 페이지 네비게이션</h1>

        <div className={styles.grid}>
          {routes.map((route, index) => (
            <Link key={index} to={route.path} className={styles.card}>
              <div className={styles.cardTitle}>{route.name}</div>
              <div className={styles.cardPath}>{route.path}</div>
            </Link>
          ))}
        </div>

        <div className={styles.info}>
          <h3 className={styles.infoTitle}>💡 사용법</h3>
          <ul className={styles.infoList}>
            <li>각 카드를 클릭하면 해당 페이지로 이동합니다</li>
            <li>ID가 필요한 페이지들은 예시 ID(1)를 사용했습니다</li>
            <li>개발 중 빠른 테스트를 위해 사용하세요</li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default DevPage;
