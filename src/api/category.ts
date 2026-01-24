import request from '@/utils/request';
import {
  ApiPathParams, ApiQuery, ApiRequestBody, ApiResponseData
} from "@/types";

/**
 *
 * 分类管理
 *
 **/

// 查询分类列表接口
export const fetchCategoryPage = (params: ApiQuery<'/admin/category/page', 'get'>) => {
  return request<ApiResponseData<'/admin/category/page', 'get'>, never, ApiQuery<'/admin/category/page', 'get'>>({
    url: '/admin/category/page',
    method: 'get',
    params
  });
};

// 删除当前列的接口
export const deleteCategory = (params: ApiQuery<'/admin/category', 'delete'>) => {
  return request<ApiResponseData<'/admin/category', 'delete'>, never, ApiQuery<'/admin/category', 'delete'>>({
    url: '/admin/category',
    method: 'delete',
    params
  });
};

// 修改接口
export const editCategory = (params: ApiRequestBody<'/admin/category', 'put'>) => {
  return request<ApiResponseData<'/admin/category', 'put'>, ApiRequestBody<'/admin/category', 'put'>, never>({
    url: '/admin/category',
    method: 'put',
    data: { ...params }
  });
};

// 新增接口
export const addCategory = (params: ApiRequestBody<'/admin/category', 'post'>) => {
  return request<ApiResponseData<'/admin/category', 'post'>, ApiRequestBody<'/admin/category', 'post'>, never>({
    url: '/admin/category',
    method: 'post',
    data: { ...params }
  });
};

// 修改---启用禁用接口
export const enableOrDisableCategory = (
    params: ApiQuery<'/admin/category/status/{status}', 'post'> &
        ApiPathParams<'/admin/category/status/{status}', 'post'>) => {
  return request<ApiResponseData<'/admin/category/status/{status}', 'post'>, never, ApiQuery<'/admin/category/status/{status}', 'post'>>({
    url: `/admin/category/status/${params.status}`,
    method: 'post',
    params: { ...params }
  })
}

export const fetchCategoriesByType = (params: ApiQuery<'/admin/category/list', 'get'>) => {
  return request<ApiResponseData<'/admin/category/list', 'get'>, never, ApiQuery<'/admin/category/list', 'get'>>({
    url: '/admin/category/list',
    method: 'get',
    params: { ...params }
  });
}
