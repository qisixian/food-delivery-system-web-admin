import request from '@/utils/request'
import {ApiResponse, PageResult} from "@/types/api.ts";

export const login = (data: any): Promise<ApiResponse> =>
    request({
        url: '/employee/login',
        method: 'post',
        data: { ...data }
    })

export const getEmployeeList = (params: any): Promise<ApiResponse<PageResult>> => {
    return request({
        url: '/employee/page',
        method: 'get',
        params
    })
}

// 修改---启用禁用接口
export const enableOrDisableEmployee = (id: any, status: any ): Promise<ApiResponse> => {
    return request({
        url: `/employee/status/${status}`,
        method: 'post',
        params: { id: id }
    })
}

// 新增---添加员工
export const addEmployee = (params: any): Promise<ApiResponse> => {
    return request({
        url: '/employee',
        method: 'post',
        data: { ...params }
    })
}

// 修改---添加员工
export const editEmployee = (params: any): Promise<ApiResponse> => {
    return request({
        url: '/employee',
        method: 'put',
        data: { ...params }
    })
}

// 修改页面反查详情接口
export const queryEmployeeById = (id: string | (string | null)[]): Promise<ApiResponse> => {
    return request({
        url: `/employee/${id}`,
        method: 'get'
    })
}
