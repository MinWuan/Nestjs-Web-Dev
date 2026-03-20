import { RoleTest } from '../../../entity';
import {
  GetRoleTestsFiltersInput,
  GetRoleTestsRangeInput,
} from '../../../api/dto/req/GetRoleTestsArgs';

interface RangeCondition<T = any> {
  from?: T;
  to?: T;
}

interface FindAllQuery<
  TEntity,
  TFilter = Partial<TEntity>,
  TRange = Partial<Record<keyof TEntity, RangeCondition>>,
> {
  /** pagination */
  page?: number;
  limit?: number;

  /** field = value (AND) */
  filters?: TFilter;

  /** range filter (date, number, etc.) */
  range?: TRange;

  /** search text */
  search?: {
    fields: string[];
    keyword: string;
  };

  /** sort */
  sort?: {
    field: string;
    order: 'ASC' | 'DESC';
  };

  /** select fields */
  select?: string[];
}

export type findAll = FindAllQuery<
  RoleTest,
  GetRoleTestsFiltersInput,
  GetRoleTestsRangeInput
>;
