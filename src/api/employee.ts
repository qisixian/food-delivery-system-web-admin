import request from '@/utils/request'
import {ApiPathParams, ApiQuery, ApiRequestBody, ApiResponseData} from "@/types";

export const login = (data: ApiRequestBody<'/admin/employee/login', 'post'>) =>
    request<ApiResponseData<'/admin/employee/login', 'post'>, ApiRequestBody<'/admin/employee/login', 'post'>, never>({
        url: '/admin/employee/login',
        method: 'post',
        data: { ...data }
    })

export const fetchEmployeePage = (params: ApiQuery<'/admin/employee/page', 'get'>) => {
    return request<ApiResponseData<'/admin/employee/page', 'get'>, never, ApiQuery<'/admin/employee/page', 'get'>>({
        url: '/admin/employee/page',
        method: 'get',
        params
    })
}

// 修改---启用禁用接口
export const enableOrDisableEmployee = (
    params: ApiQuery<'/admin/employee/status/{status}', 'post'> &
        ApiPathParams<'/admin/employee/status/{status}', 'post'>) => {
    return request<ApiResponseData<'/admin/employee/status/{status}', 'post'>, never, ApiQuery<'/admin/employee/status/{status}', 'post'>>({
        url: `/admin/employee/status/${params.status}`,
        method: 'post',
        params: { id: params.id }
    })
}

// 新增---添加员工
export const addEmployee = (params: ApiRequestBody<'/admin/employee', 'post'>) => {
    return request<ApiResponseData<'/admin/employee', 'post'>, ApiRequestBody<'/admin/employee', 'post'>, never>({
        url: '/admin/employee',
        method: 'post',
        data: { ...params }
    })
}

// 修改---添加员工
export const editEmployee = (params: ApiRequestBody<'/admin/employee', 'put'>) => {
    return request<ApiResponseData<'/admin/employee', 'put'>, ApiRequestBody<'/admin/employee', 'put'>, never>({
        url: '/admin/employee',
        method: 'put',
        data: { ...params }
    })
}

// 修改页面反查详情接口
export const queryEmployeeById = (params: ApiPathParams<'/admin/employee/{id}', 'get'>) => {
    return request<ApiResponseData<'/admin/employee/{id}', 'get'>, never, never>({
        url: `/admin/employee/${params.id}`,
        method: 'get'
    })
}
