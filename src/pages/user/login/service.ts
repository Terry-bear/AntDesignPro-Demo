import request from 'umi-request';
import { FromDataType } from './index';

export async function fakeAccountLogin(params: FromDataType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}
