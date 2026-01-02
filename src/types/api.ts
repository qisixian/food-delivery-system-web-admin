export type ApiResponse<T = unknown> = {
    code: number | string;
    msg: string;
    data: T;
};

export type PageResult<T = unknown> = {
    records: T[];
    total: number;
};
