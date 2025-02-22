// import api from 'axios';
// import { LoginForm, LoginResponse } from '@/types/auth';

// export const authService = {
//   async login(data: LoginForm): Promise<LoginResponse> {
//     try {
//       const response = await api.post<LoginResponse>('/CM0101Login', data);
//       return response.data;
//     } catch (error) {
//       if (error instanceof Error) {
//         alert('비밀번호가 틀립니다.');
//         return {} as LoginResponse;
//       } else {
//         alert('(오류발생)다시 시도해주세요.');
//         return {} as LoginResponse;
//       }
//     }
//   },
// };
