import { createBrowserRouter } from 'react-router-dom';

import App from '@/App';
import AuthLayout from '@/layouts/AuthLayout/AuthLayout';
import MapLayout from '@/layouts/MapLayout/MapLayout';
import PersonalizationLayout from '@/layouts/PersonalizationLayout/PersonalizationLayout';
import PostLayout from '@/layouts/PostLayout/PostLayout';
import ProfileLayout from '@/layouts/ProfileLayout/ProfileLayout';
import SearchLayout from '@/layouts/SearchLayout/SearchLayout';
import TeamLayout from '@/layouts/TeamLayout/TeamLayout';
import FindIdCompletePage from '@/pages/auth/FindIdCompletePage/FindIdCompletePage';
import FindIdPage from '@/pages/auth/FindIdPage/FindIdPage';
import FindPasswordPage from '@/pages/auth/FindPasswordPage/FindPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage/ResetPasswordPage';
import SignInPage from '@/pages/auth/SignInPage/SignInPage';
import SignUpCompletePage from '@/pages/auth/SignUpCompletePage/SignUpCompletePage';
import SignUpPage from '@/pages/auth/SignUpPage/SignUpPage';
import ButtonExamplePage from '@/pages/ButtonExamplePage/ButtonExamplePage';
import CreateProjectPage from '@/pages/create/CreateProjectPage/CreateProjectPage';
import CreateStudyPage from '@/pages/create/CreateStudyPage/CreateStudyPage';
import DetailProjectPage from '@/pages/detail/DetailProjectPage/DetailProjectPage';
import DetailStudyPage from '@/pages/detail/DetailStudyPage/DetailStudyPage';
import DevPage from '@/pages/Dev/DevPage';
import EditMyInfoPage from '@/pages/edit/EditMyInfoPage/EditMyInfoPage';
import EditProjectPage from '@/pages/edit/EditProjectPage/EditProjectPage';
import EditStudyPage from '@/pages/edit/EditStudyPage/EditStudyPage';
import IntroPage from '@/pages/intro/IntroPage/IntroPage';
import MapPage from '@/pages/map/MapPage/MapPage';
import PersonalizationPage from '@/pages/personalization/PersonalizationPage/PersonalizationPage';
import MyProfilePage from '@/pages/profile/MyProfilePage/MyProfilePage';
import UserProfilePage from '@/pages/profile/UserProfilePage/UserProfilePage';
import RankingPage from '@/pages/ranking/RankingPage/RankingPage';
import SearchPlayerPage from '@/pages/search/SearchPlayerPage/SearchPlayerPage';
import SearchProjectPage from '@/pages/search/SearchProjectPage/SearchProjectPage';
import SearchStudyPage from '@/pages/search/SearchStudyPage/SearchStudyPage';
import TeamPage from '@/pages/team/TeamPage/TeamPage';
import TeamSettingPage from '@/pages/team/TeamSettingPage/TeamSettingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />, // 글로벌 컴포넌트용
    children: [
      // NOTE: 개발용 페이지. 추후 삭제 필요 (기존 코드에 영향 없음)
      {
        index: true,
        element: <DevPage />,
      },
      {
        //TODO: 추후 개발 완료 시 index:true로 변경 필요
        // index: true,
        path: '/intro',
        element: <IntroPage />,
      },
      {
        element: <AuthLayout />,
        children: [
          {
            path: 'auth/signin',
            element: <SignInPage />,
          },
          {
            path: 'auth/signup',
            element: <SignUpPage />,
          },
          {
            path: 'auth/signupcomplete',
            element: <SignUpCompletePage />,
          },
          {
            path: 'auth/findid',
            element: <FindIdPage />,
          },
          {
            path: 'auth/findidcomplete',
            element: <FindIdCompletePage />,
          },
          {
            path: 'auth/findpassword',
            element: <FindPasswordPage />,
          },
          {
            path: 'auth/resetpassword',
            element: <ResetPasswordPage />,
          },
        ],
      },
      {
        element: <PersonalizationLayout />,
        children: [
          {
            path: 'personalization',
            element: <PersonalizationPage />,
          },
        ],
      },
      {
        element: <MapLayout />,
        children: [
          {
            path: 'map',
            element: <MapPage />,
          },
        ],
      },
      {
        element: <SearchLayout />,
        children: [
          {
            path: 'search/project',
            element: <SearchProjectPage />,
          },
          {
            path: 'search/study',
            element: <SearchStudyPage />,
          },
          {
            path: 'search/player',
            element: <SearchPlayerPage />,
          },
        ],
      },
      {
        element: <PostLayout />,
        children: [
          {
            path: 'create/project',
            element: <CreateProjectPage />,
          },
          {
            path: 'edit/project/:id',
            element: <EditProjectPage />,
          },
          {
            path: 'create/study',
            element: <CreateStudyPage />,
          },
          {
            path: 'edit/study/:id',
            element: <EditStudyPage />,
          },
          {
            path: 'detail/project/:id',
            element: <DetailProjectPage />,
          },
          {
            path: 'detail/study/:id',
            element: <DetailStudyPage />,
          },
        ],
      },
      {
        element: <ProfileLayout />,
        children: [
          {
            path: 'profile/user/:id',
            element: <UserProfilePage />,
          },
          {
            path: 'profile/my',
            element: <MyProfilePage />,
          },
          {
            path: 'profile/my/edit',
            element: <EditMyInfoPage />,
          },
        ],
      },
      {
        element: <TeamLayout />,
        children: [
          {
            path: 'team/:id',
            element: <TeamPage />,
          },
          {
            path: 'team/:id/setting',
            element: <TeamSettingPage />,
          },
        ],
      },
      {
        path: 'ranking',
        element: <RankingPage />,
      },
      {
        path: 'button-example',
        element: <ButtonExamplePage />,
      },
    ],
  },
]);
