import request from '@/utils/request'

export const login = (data: any) =>
    request({
        url: '/employee/login',
        method: 'post',
        data: { ...data }
    })

export const getEmployeeList = (params: any) => {
    return request({
        url: '/employee/page',
        method: 'get',
        params
    })
}

// 修改---启用禁用接口
export const enableOrDisableEmployee = (params: any) => {
    return request({
        url: `/employee/status/${params.status}`,
        method: 'post',
        params: { id:params.id }
    })
}

// 新增---添加员工
export const addEmployee = (params: any) => {
    return request({
        url: '/employee',
        method: 'post',
        data: { ...params }
    })
}

// 修改---添加员工
export const editEmployee = (params: any) => {
    return request({
        url: '/employee',
        method: 'put',
        data: { ...params }
    })
}

// 修改页面反查详情接口
export const queryEmployeeById = (id: string | (string | null)[]) => {
    return request({
        url: `/employee/${id}`,
        method: 'get'
    })
}
