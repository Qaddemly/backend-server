import { SelectQueryBuilder } from 'typeorm';

interface PaginationObject {
    currentPage?: number;
    limit?: number;
    numberOfPages?: number;
    nextPage?: number;
    previousPage?: number;
}

interface QueryObject {
    [key: string]: any;
    page?: string;
    limit?: string;
    sort?: string;
    fields?: string;
    keyword?: string;
}

export class ApiFeatures<Entity> {
    public pagination: PaginationObject = {};

    constructor(
        public queryBuilder: SelectQueryBuilder<Entity>,
        public reqQuery: QueryObject,
    ) {}

    /**
     * Apply filtering to the query
     */
    filter() {
        const queryObj = { ...this.reqQuery };
        const excludeFields = ['page', 'limit', 'fields', 'sort', 'keyword'];
        excludeFields.forEach((field) => delete queryObj[field]);

        Object.keys(queryObj).forEach((key) => {
            if (
                typeof queryObj[key] === 'string' &&
                /\b(gt|lt|gte|lte|ne)\b/.test(key)
            ) {
                const [field, operator] = key.split('__');
                const value = queryObj[key];
                const sqlOperator = this.convertOperator(operator);
                if (sqlOperator) {
                    this.queryBuilder.andWhere(
                        `${field} ${sqlOperator} :value`,
                        {
                            value,
                        },
                    );
                }
            } else {
                this.queryBuilder.andWhere(`${key} = :value`, {
                    value: queryObj[key],
                });
            }
        });

        return this;
    }

    /**
     * Apply sorting to the query
     */
    sorting() {
        if (this.reqQuery.sort) {
            const sortBy = this.reqQuery.sort.split(',').map((field) => {
                if (field.startsWith('-')) {
                    return `${field.slice(1)} DESC`;
                }
                return `${field} ASC`;
            });
            this.queryBuilder.orderBy(sortBy.join(', '));
        } else {
            this.queryBuilder.orderBy('created_at', 'DESC');
        }

        return this;
    }

    /**
     * Limit fields (select specific fields)
     */
    limitFields(): this {
        if (this.reqQuery.fields) {
            const fields = this.reqQuery.fields.split(',').join(', ');
            this.queryBuilder.select(fields);
        } else {
            this.queryBuilder.select('*'); // Select all fields by default
        }

        return this;
    }

    /**
     * Perform searching
     */
    searching(searchFields: string[]): this {
        if (this.reqQuery.keyword) {
            const keyword = this.reqQuery.keyword;
            const searchConditions = searchFields.map((field) => {
                return `${field} ILIKE :keyword`;
            });

            this.queryBuilder.andWhere(`(${searchConditions.join(' OR ')})`, {
                keyword: `%${keyword}%`,
            });
        }

        return this;
    }

    /**
     * Apply pagination
     */
    paginate(totalCount: number) {
        const page = this.reqQuery.page ? parseInt(this.reqQuery.page, 10) : 1;
        const limit = this.reqQuery.limit
            ? parseInt(this.reqQuery.limit, 10)
            : 50;
        const skip = (page - 1) * limit;

        this.queryBuilder.skip(skip).take(limit);

        const numberOfPages = Math.ceil(totalCount / limit);
        this.pagination = {
            currentPage: page,
            limit,
            numberOfPages,
            nextPage: page < numberOfPages ? page + 1 : undefined,
            previousPage: page > 1 ? page - 1 : undefined,
        };

        return this;
    }

    /**
     * Convert Mongoose-like operators to SQL
     */
    private convertOperator(operator: string): string | null {
        switch (operator) {
            case 'gt':
                return '>';
            case 'gte':
                return '>=';
            case 'lt':
                return '<';
            case 'lte':
                return '<=';
            case 'ne':
                return '!=';
            default:
                return null;
        }
    }
}
