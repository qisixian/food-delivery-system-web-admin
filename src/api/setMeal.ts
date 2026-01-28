import request from '@/utils/request'
import {ApiPathParams, ApiQuery, ApiRequestBody, ApiResponseData} from "@/types";
/**
 *
 * 套餐管理
 *
 **/

// 查询列表数据
export const fetchSetmealPage = (params: ApiQuery<'/admin/setmeal/page', 'get'>) => {
  return request<ApiResponseData<'/admin/setmeal/page', 'get'>, never, ApiQuery<'/admin/setmeal/page', 'get'>>({
    url: '/admin/setmeal/page',
    method: 'get',
    params,
  })
}

// 删除数据接口
export const deleteSetmeal = (params: ApiQuery<'/admin/setmeal', 'delete'>) => {
  return request<ApiResponseData<'/admin/setmeal', 'delete'>, never, ApiQuery<'/admin/setmeal', 'delete'>>({
    url: '/admin/setmeal',
    method: 'delete',
    params
  })
}

// 修改数据接口
export const editSetmeal = (params: ApiRequestBody<'/admin/setmeal', 'put'>) => {
  return request<ApiResponseData<'/admin/setmeal', 'put'>, ApiRequestBody<'/admin/setmeal', 'put'>, never>({
    url: '/admin/setmeal',
    method: 'put',
    data: { ...params }
  })
}

// 新增数据接口
export const addSetmeal = (params: ApiRequestBody<'/admin/setmeal', 'post'>) => {
  return request<ApiResponseData<'/admin/setmeal', 'post'>, ApiRequestBody<'/admin/setmeal', 'post'>, never>({
    url: '/admin/setmeal',
    method: 'post',
    data: { ...params }
  })
}

// 查询详情接口
export const querySetmealById = (params: ApiPathParams<'/admin/setmeal/{id}', 'get'>) => {
  return request<ApiResponseData<'/admin/setmeal/{id}', 'get'>, never, never>({
    url: `/admin/setmeal/${params.id}`,
    method: 'get'
  })
}

// 批量起售禁售
export const enableOrDisableSetmeal = (
    params: ApiQuery<'/admin/dish/status/{status}', 'post'> &
        ApiPathParams<'/admin/dish/status/{status}', 'post'>) => {
  return request<ApiResponseData<'/admin/dish/status/{status}', 'post'>, never, ApiQuery<'/admin/dish/status/{status}', 'post'>>({
    url: `/admin/setmeal/status/${params.status}`,
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
