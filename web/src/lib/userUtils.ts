import { userService } from '@/services/user.service';

// 사용자별 고유 ID 생성 및 관리
export const generateUserId = (username: string): string => {
  // username을 기반으로 고유한 ID 생성
  // 한글과 특수문자를 안전한 문자열로 변환
  const safeUsername = username
    .replace(/[^a-zA-Z0-9가-힣]/g, '') // 한글, 영문, 숫자만 허용
    .toLowerCase();
  
  // 현재 시간을 추가하여 고유성 보장
  const timestamp = Date.now().toString(36);
  
  return `${safeUsername}_${timestamp}`;
};

// 사용자 ID 캐시 (메모리 기반)
const userIdCache = new Map<string, string>();

/**
 * username으로 사용자 ID를 가져오는 함수
 * 캐싱을 통해 성능을 최적화합니다.
 */
export const getUserIdFromId = async (id: string): Promise<string> => {
  console.log(userIdCache.has(id));
  // 캐시에서 먼저 확인
  if (userIdCache.has(id)) {
    return userIdCache.get(id)!;
  }

  try {
    const response = await userService.findUserById(id);
    if (response?.data?.id) {
      // 캐시에 저장
      userIdCache.set(id, response.data);
      return response.data;
    }
  } catch (error) {
    console.error('Error getting user ID from username:', error);
  }

  // 실패 시 username을 그대로 반환 (fallback)
  return id;
};

/**
 * 동기 버전의 getUserIdFromUsername (캐시된 값만 사용)
 */
export const getUserIdFromUsernameSync = (username: string): string => {
  return userIdCache.get(username) || username;
};

/**
 * 캐시를 클리어하는 함수
 */
export const clearUserIdCache = (): void => {
  userIdCache.clear();
};

// userId로부터 username 추출 (실제로는 데이터베이스에서 조회해야 함)
export const getUsernameFromUserId = (userId: string): string => {
  // 임시로 userId에서 username 추출
  // 실제로는 데이터베이스 조회 필요
  return userId.replace(/^user_/, '');
}; 