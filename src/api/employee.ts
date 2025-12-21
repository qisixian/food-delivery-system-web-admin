import request from '@/utils/request'

export const login = (data: any) =>
    request({
        'url': '/employee/login',
        'method': 'post',
        data: { ...data }
    })

export const queryEmployeeById = (id: string | (string | null)[]) => {
    return request({
        url: `/employee/${id}`,
        method: 'get'
    })
}
