import request from '@/utils/request';
import { TransformedResponse, RequestNoPageListParams } from 'Api';
import { MenuParams } from './params';

export function useMenuApi() {
  return {
    /**
     * 获取菜单列表
     * @author Peng
     * @date 2023-04-18
     * @param {any} params:RequestNoPageListParams
     * @returns {any}
     */
    getMenus<T = any>(params: RequestNoPageListParams): TransformedResponse<T> {
      return request({
        url: '/menu',
        method: 'get',
        params,
      });
    },
    /**
     * 添加菜单
     * @author Peng
     * @date 2023-04-18
     * @param {any} data:MenuParams
     * @returns {any}
     */
    addMenu<T = any>(data: MenuParams): TransformedResponse<T> {
      return request({
        url: '/menu',
        method: 'post',
        data: JSON.stringify(data),
      });
    },
    /**
     * 删除菜单
     * @author Peng
     * @date 2023-04-18
     * @param {any} id:number
     * @param {any} params:object
     * @returns {any}
     */
    deleteMenu<T = string>(id: number): TransformedResponse<T> {
      return request({
        url: `/menu/${id}`,
        method: 'delete',
      });
    },
    /**
     * 更新菜单信息
     * @author Peng
     * @date 2023-04-18
     * @param {any} id:number
     * @param {any} params:object
     * @returns {any}
     */
    updataMenu(id: number, params: object) {
      return request({
        url: `/menu/updateMenuById/${id}`,
        method: 'put',
        data: JSON.stringify(params),
      });
    },
    /**
     * 添加全部默认菜单
     * @author Peng
     * @date 2023-06-12
     * @param {any} menus:any[]
     * @returns {any}
     */
    addAllDefaultMenu(menus: any[]) {
      return request({
        url: '/menu/addAllDefaultMenus',
        method: 'post',
        data: JSON.stringify(menus),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
  };
}
