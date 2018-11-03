import { stringify } from 'qs';
import request from '@/utils/request';

export default async function queryTeamStatistic(params) {
  return request(`/api/registration/team_stat_data?${stringify(params)}`);
}
