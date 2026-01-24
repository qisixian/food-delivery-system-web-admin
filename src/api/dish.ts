import request from '@/utils/request'
import {ApiPathParams, ApiQuery, ApiRequestBody, ApiResponseData} from "@/types";
/**
 *
 * 菜品管理
 *
 **/
// 查询列表接口
export const fetchDishPage = (params: ApiQuery<'/admin/dish/page', 'get'>)  => {
  return request<ApiResponseData<'/admin/dish/page', 'get'>, never, ApiQuery<'/admin/dish/page', 'get'>>({
    url: '/admin/dish/page',
    method: 'get',
    params
  })
}

// 删除接口
export const deleteDish = (params: ApiQuery<'/admin/dish', 'delete'>) => {
  return request<ApiResponseData<'/admin/dish', 'delete'>, never, ApiQuery<'/admin/dish', 'delete'>>({
    url: '/admin/dish',
    method: 'delete',
    params
  })
}

// 修改接口
export const editDish = (params: ApiRequestBody<'/admin/dish', 'put'>) => {
  return request<ApiResponseData<'/admin/dish', 'put'>, ApiRequestBody<'/admin/dish', 'put'>, never>({
    url: '/admin/dish',
    method: 'put',
    data: { ...params }
  })
}

// 新增接口
export const addDish = (params: ApiRequestBody<'/admin/dish', 'post'>) => {
  return request<ApiResponseData<'/admin/dish', 'post'>, ApiRequestBody<'/admin/dish', 'post'>, never>({
    url: '/admin/dish',
    method: 'post',
    data: { ...params }
  })
}

// 查询详情
export const queryDishById = (params: ApiPathParams<'/admin/dish/{id}', 'get'>) => {
  return request<ApiResponseData<'/admin/dish/{id}', 'get'>, never, never>({
    url: `/admin/dish/${params.id}`,
    method: 'get'
  })
}

// 获取菜品分类列表
export const getCategoryList = (params: ApiQuery<'/admin/category/list', 'get'>) => {
  return request<ApiResponseData<'/admin/category/list', 'get'>, never, ApiQuery<'/admin/category/list', 'get'>>({
    url: '/admin/category/list',
    method: 'get',
    params
  })
}

// 查菜品列表的接口
export const queryDishList = (params: ApiQuery<'/admin/dish/list', 'get'>) => {
  return request<ApiResponseData<'/admin/dish/list', 'get'>, never, ApiQuery<'/admin/dish/list', 'get'>>({
    url: '/admin/dish/list',
    method: 'get',
    params
  })
}

// 文件down预览
// export const commonDownload = (params: any) => {
//   return request<ApiResponseBody<'/admin/common/download', 'get'>, never, ApiQuery<'/admin/common/download', 'get'>>({
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
//     },
//     url: '/admin/common/download',
//     method: 'get',
//     params
//   })
// }

// 起售停售---批量起售停售接口
export const changeDishStatus = (
    params: ApiQuery<'/admin/dish/status/{status}', 'post'> &
        ApiPathParams<'/admin/dish/status/{status}', 'post'>) => {
  return request<ApiResponseData<'/admin/dish/status/{status}', 'post'>, never, ApiQuery<'/admin/dish/status/{status}', 'post'>>({
    url: `/admin/dish/status/${params.status}`,
    method: 'post',
    params: { id: params.id }
  })
}

//菜品分类数据查询
export const dishCategoryList = (params: ApiQuery<'/admin/category/list', 'get'>) => {
  return request<ApiResponseData<'/admin/category/list', 'get'>, never, ApiQuery<'/admin/category/list', 'get'>>({
    url: `/admin/category/list`,
    method: 'get',
    params: { ...params }
  })
}
