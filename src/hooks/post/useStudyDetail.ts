import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '@/api/api';
import { DDtoast } from '@/features/toast';
import type { DetailStudyResponse } from '@/types/study';

interface UseStudyDetailProps {
  studyId: number;
}

// 스터디 참여 신청/취소 응답 타입
interface StudyJoinResponse {
  status: number;
  message: string;
  data: {
    isApplied: boolean;
  } | null;
}

export const useStudyDetail = ({ studyId }: UseStudyDetailProps) => {
  console.log('🎯 useStudyDetail 훅이 호출되었습니다! studyId:', studyId);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 스터디 상세 조회
  const {
    data: studyResponse,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['study', 'detail', studyId],
    queryFn: async (): Promise<DetailStudyResponse> => {
      console.log('📡 API 호출 시작 - studyId:', studyId);
      try {
        const { data } = await api.get<DetailStudyResponse>(`/api/studies/${studyId}`);
        console.log('✅ API 응답 성공:', data);
        return data;
      } catch (error) {
        console.error('❌ API 호출 에러:', error);

        // API 에러 시 토스트 표시
        DDtoast({
          mode: 'server-first',
          userMessage: '스터디 정보를 불러오는데 실패했습니다.',
          apiResponse: error,
        });

        throw error;
      }
    },
    enabled: !!studyId && studyId > 0,
  });

  console.log('📊 useStudyDetail 상태:', {
    studyId,
    isLoading,
    error,
    hasData: !!studyResponse,
    enabled: !!studyId && studyId > 0,
  });

  // 스터디 참여 신청/취소
  const joinStudyMutation = useMutation({
    mutationFn: async (): Promise<StudyJoinResponse> => {
      const { data } = await api.post<StudyJoinResponse>(`/api/studies/${studyId}/join`, {});
      return data;
    },
    onSuccess: response => {
      // 성공 시 스터디 상세 정보 다시 조회
      queryClient.invalidateQueries({ queryKey: ['study', 'detail', studyId] });

      // 성공 토스트 표시
      if (response.data?.isApplied) {
        DDtoast({
          mode: 'server-first',
          type: 'success',
          userMessage: '스터디에 성공적으로 지원하였습니다! 🎉',
          apiResponse: response,
        });

        console.log('스터디에 참여 신청했습니다.');
      } else {
        DDtoast({
          mode: 'server-first',
          type: 'info',
          userMessage: '스터디 참여 신청을 취소했습니다.',
          apiResponse: response,
        });

        console.log('스터디 참여 신청을 취소했습니다.');
      }
    },
    onError: error => {
      console.error('스터디 참여 신청/취소 실패:', error);

      // 에러 토스트 표시
      DDtoast({
        mode: 'server-first',
        userMessage: '스터디 참여 신청 중 문제가 발생했습니다.',
        apiResponse: error,
      });
    },
  });

  // 스터디 수정 페이지로 이동
  const handleEditStudy = () => {
    navigate(`/edit/study/${studyId}`);
  };

  // 팀 관리 페이지로 이동
  const handleTeamManagement = () => {
    if (studyResponse?.data.teamId) {
      navigate(`/team/${studyResponse.data.teamId}/setting`);
    } else {
      DDtoast({
        mode: 'custom',
        type: 'error',
        userMessage: '팀 정보를 찾을 수 없습니다.',
      });
    }
  };

  // 스터디 참여 신청하기
  const handleApplyStudy = () => {
    joinStudyMutation.mutate();
  };

  // 참여 신청 취소하기
  const handleCancelApplication = () => {
    joinStudyMutation.mutate();
  };

  return {
    studyData: studyResponse?.data,
    isLoading,
    error,

    // 액션
    handleEditStudy,
    handleTeamManagement,
    handleApplyStudy,
    handleCancelApplication,
    refetch,

    // 뮤테이션 상태
    isJoining: joinStudyMutation.isPending,
  };
};
