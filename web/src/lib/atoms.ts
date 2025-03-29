import {atom} from 'recoil';
import { LoginResponse } from '@/types/user/type';

export const userState = atom<LoginResponse | null>({
    key: 'userState',
    default: null,
})